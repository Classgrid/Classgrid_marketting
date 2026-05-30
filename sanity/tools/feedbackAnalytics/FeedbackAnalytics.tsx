import React, { useEffect, useState, useMemo } from 'react'
import { useClient } from 'sanity'
import { Card, Text, Box, Stack, Heading, Badge, Spinner } from '@sanity/ui'

export function FeedbackAnalytics() {
  const client = useClient({ apiVersion: '2024-05-30' })
  const indianFormat = new Intl.NumberFormat('en-IN')
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetches up to the 40,000 most recent feedback entries total
    client.fetch(`*[_type == "websiteFeedback"] | order(submittedAt desc)[0...40000]`).then((res) => {
      setData(res)
      setLoading(false)
    })
  }, [client])

  const stats = useMemo(() => {
    if (!data.length) return []
    const groups: Record<string, any> = {}
    data.forEach(item => {
      const url = item.pageUrl || 'Unknown'
      if (!groups[url]) {
        groups[url] = { url, title: item.pageTitle || '', total: 0, comments: 0, emojis: { great: 0, okay: 0, bad: 0, terrible: 0 } }
      }
      groups[url].total++
      if (item.message) groups[url].comments++
      if (item.reaction) {
        groups[url].emojis[item.reaction] = (groups[url].emojis[item.reaction] || 0) + 1
      }
      // Keep the latest pageTitle
      if (item.pageTitle && !groups[url].title) groups[url].title = item.pageTitle
    })
    return Object.values(groups).sort((a, b) => b.total - a.total)
  }, [data])

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '400px' }}>
        <Spinner />
      </div>
    )
  }

  const totalFeedbacks = data.length
  const uniquePages = stats.length
  const highestRatedPage = stats.length > 0 ? [...stats].sort((a, b) => (b.emojis['great'] || 0) - (a.emojis['great'] || 0))[0] : null
  const lowestRatedPage = stats.length > 0 ? [...stats].sort((a, b) => (b.emojis['terrible'] || 0) - (a.emojis['terrible'] || 0))[0] : null

  const formatPageName = (url: string, title?: string) => {
    if (title) return title
    if (!url || url === 'Unknown') return 'Unknown Page'
    const parts = url.split('/').filter(Boolean)
    const lastPart = parts[parts.length - 1] || 'Home'
    return lastPart.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  }

  return (
    <div style={{ padding: '24px', overflowY: 'auto', height: '100%', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* Header */}
        <Card padding={4} radius={3} shadow={1} tone="primary" style={{ marginBottom: '24px' }}>
          <Stack space={3}>
            <Heading size={3}>📊 Feedback Analytics</Heading>
            <Text size={1} muted>
              Real-time analytics from your website's "Was this helpful?" widget. Data appears here automatically when users submit feedback.
            </Text>
          </Stack>
        </Card>

        {/* Summary Cards Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          
          {/* Total */}
          <Card padding={4} shadow={1} radius={3} style={{ borderTop: '4px solid #3b82f6' }}>
            <Stack space={3}>
              <Text size={1} weight="semibold" muted style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '11px' }}>
                Total Feedbacks
              </Text>
              <Heading size={4}>{indianFormat.format(totalFeedbacks)}</Heading>
              <Text size={1} muted>
                {uniquePages > 0 ? `Across ${indianFormat.format(uniquePages)} pages` : 'No pages yet'}
              </Text>
            </Stack>
          </Card>

          {/* Most Loved */}
          <Card padding={4} shadow={1} radius={3} style={{ borderTop: '4px solid #10b981' }}>
            <Stack space={3}>
              <Text size={1} weight="semibold" muted style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '11px' }}>
                Most Loved 🤩
              </Text>
              <Text size={2} weight="bold" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {highestRatedPage && highestRatedPage.emojis['great'] > 0
                  ? formatPageName(highestRatedPage.url, highestRatedPage.title)
                  : '—'}
              </Text>
              <Text size={1} muted>
                {highestRatedPage && highestRatedPage.emojis['great'] > 0
                  ? `${indianFormat.format(highestRatedPage.emojis['great'])} awesome ratings`
                  : 'Awaiting feedback'}
              </Text>
            </Stack>
          </Card>

          {/* Needs Attention */}
          <Card padding={4} shadow={1} radius={3} style={{ borderTop: '4px solid #ef4444' }}>
            <Stack space={3}>
              <Text size={1} weight="semibold" muted style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '11px' }}>
                Needs Attention 😭
              </Text>
              <Text size={2} weight="bold" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {lowestRatedPage && lowestRatedPage.emojis['terrible'] > 0
                  ? formatPageName(lowestRatedPage.url, lowestRatedPage.title)
                  : '—'}
              </Text>
              <Text size={1} muted>
                {lowestRatedPage && lowestRatedPage.emojis['terrible'] > 0
                  ? `${indianFormat.format(lowestRatedPage.emojis['terrible'])} negative ratings`
                  : 'No negative feedback'}
              </Text>
            </Stack>
          </Card>
        </div>

        {/* Section Title */}
        <Heading size={2} style={{ marginBottom: '16px' }}>Page Breakdown</Heading>

        {/* Empty State */}
        {stats.length === 0 && (
          <Card padding={5} shadow={1} radius={3} style={{ textAlign: 'center' }}>
            <Stack space={3} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Text size={4}>📭</Text>
              <Text size={2} weight="semibold">No feedback yet</Text>
              <Text size={1} muted>
                When visitors use the "Was this helpful?" widget on your blog posts, comparisons, help articles, and other detail pages, their responses will appear here.
              </Text>
            </Stack>
          </Card>
        )}

        {/* Page Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {stats.map((stat, i) => (
            <Card key={i} padding={4} shadow={1} radius={3} style={{ borderLeft: '3px solid #8b5cf6' }}>
              <Stack space={4}>
                {/* Page Title + Badges */}
                <div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                    <Badge tone="primary">{indianFormat.format(stat.total)} total</Badge>
                    {stat.comments > 0 && <Badge tone="default">{indianFormat.format(stat.comments)} comments</Badge>}
                  </div>
                  <Text size={2} weight="bold" style={{ lineHeight: '1.4', marginBottom: '4px' }}>
                    {formatPageName(stat.url, stat.title)}
                  </Text>
                  <Text size={1} muted style={{ wordBreak: 'break-all' }}>
                    {stat.url}
                  </Text>
                </div>

                {/* Emoji Breakdown */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  <div style={{ background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', padding: '8px 4px', textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', marginBottom: '2px' }}>🤩</div>
                    <Text size={1} weight="bold" style={{ color: '#10b981' }}>{indianFormat.format(stat.emojis['great'] || 0)}</Text>
                  </div>
                  <div style={{ background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px', padding: '8px 4px', textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', marginBottom: '2px' }}>😐</div>
                    <Text size={1} weight="bold" style={{ color: '#f59e0b' }}>{indianFormat.format(stat.emojis['okay'] || 0)}</Text>
                  </div>
                  <div style={{ background: 'rgba(244, 63, 94, 0.1)', borderRadius: '8px', padding: '8px 4px', textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', marginBottom: '2px' }}>😞</div>
                    <Text size={1} weight="bold" style={{ color: '#f43f5e' }}>{indianFormat.format(stat.emojis['bad'] || 0)}</Text>
                  </div>
                  <div style={{ background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', padding: '8px 4px', textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', marginBottom: '2px' }}>😭</div>
                    <Text size={1} weight="bold" style={{ color: '#ef4444' }}>{indianFormat.format(stat.emojis['terrible'] || 0)}</Text>
                  </div>
                </div>
              </Stack>
            </Card>
          ))}
        </div>

        {/* Bottom Spacer */}
        <div style={{ height: '40px' }}></div>
      </div>
    </div>
  )
}

export default FeedbackAnalytics
