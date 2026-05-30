import React, { useEffect, useState, useMemo } from 'react'
import { useClient } from 'sanity'
import { Card, Text, Box, Stack, Heading, Badge, Spinner } from '@sanity/ui'

export function FeedbackAnalytics() {
  const client = useClient({ apiVersion: '2024-05-30' })
  const indianFormat = new Intl.NumberFormat('en-IN')
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  useEffect(() => {
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

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  return (
    <div style={{ padding: '24px', overflowY: 'auto', height: '100%', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* Header */}
        <Card padding={4} radius={3} shadow={1} tone="primary" style={{ marginBottom: '24px' }}>
          <Stack space={3}>
            <Heading size={3}>📊 Feedback Analytics</Heading>
            <Text size={1} muted>
              Real-time analytics from your "Was this helpful?" widget. Click any page below to see its detailed breakdown.
            </Text>
          </Stack>
        </Card>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          
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
              <div style={{ fontSize: '15px', fontWeight: 700, wordBreak: 'break-word', paddingTop: '2px', paddingBottom: '2px', color: 'var(--card-fg-color)' }}>
                {highestRatedPage && highestRatedPage.emojis['great'] > 0
                  ? formatPageName(highestRatedPage.url, highestRatedPage.title)
                  : '—'}
              </div>
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
              <div style={{ fontSize: '15px', fontWeight: 700, wordBreak: 'break-word', paddingTop: '2px', paddingBottom: '2px', color: 'var(--card-fg-color)' }}>
                {lowestRatedPage && lowestRatedPage.emojis['terrible'] > 0
                  ? formatPageName(lowestRatedPage.url, lowestRatedPage.title)
                  : '—'}
              </div>
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
                When visitors use the "Was this helpful?" widget on your pages, their responses will appear here.
              </Text>
            </Stack>
          </Card>
        )}

        {/* Page Accordion List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {stats.map((stat, i) => {
            const isExpanded = expandedIndex === i
            return (
              <div key={i}>
                {/* Clickable Row */}
                <button
                  onClick={() => toggleExpand(i)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    padding: '14px 16px',
                    background: isExpanded ? 'var(--card-bg2-color, rgba(255,255,255,0.05))' : 'transparent',
                    border: '1px solid var(--card-border-color, rgba(255,255,255,0.1))',
                    borderRadius: isExpanded ? '10px 10px 0 0' : '10px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: 'inherit',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseOver={(e) => { if (!isExpanded) e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
                  onMouseOut={(e) => { if (!isExpanded) e.currentTarget.style.background = 'transparent' }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '16px', fontWeight: 600, wordBreak: 'break-word', textAlign: 'left', color: 'var(--card-fg-color)', paddingTop: '2px', paddingBottom: '2px' }}>
                      {formatPageName(stat.url, stat.title)}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    <Badge tone="primary">{indianFormat.format(stat.total)}</Badge>
                    <span style={{ fontSize: '14px', transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                  </div>
                </button>

                {/* Expandable Details */}
                {isExpanded && (
                  <div style={{
                    border: '1px solid var(--card-border-color, rgba(255,255,255,0.1))',
                    borderTop: 'none',
                    borderRadius: '0 0 10px 10px',
                    padding: '16px',
                    background: 'var(--card-bg2-color, rgba(255,255,255,0.02))',
                  }}>
                    <Stack space={4}>
                      {/* Badges */}
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <Badge tone="primary">{indianFormat.format(stat.total)} total feedbacks</Badge>
                        {stat.comments > 0 && <Badge tone="default">{indianFormat.format(stat.comments)} comments</Badge>}
                      </div>

                      {/* Emoji Grid */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                        <div style={{ background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', padding: '12px 4px', textAlign: 'center' }}>
                          <div style={{ fontSize: '20px', marginBottom: '4px' }}>🤩</div>
                          <Text size={2} weight="bold" style={{ color: '#10b981' }}>{indianFormat.format(stat.emojis['great'] || 0)}</Text>
                          <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '4px' }}>Great</div>
                        </div>
                        <div style={{ background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px', padding: '12px 4px', textAlign: 'center' }}>
                          <div style={{ fontSize: '20px', marginBottom: '4px' }}>😐</div>
                          <Text size={2} weight="bold" style={{ color: '#f59e0b' }}>{indianFormat.format(stat.emojis['okay'] || 0)}</Text>
                          <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '4px' }}>Okay</div>
                        </div>
                        <div style={{ background: 'rgba(244, 63, 94, 0.1)', borderRadius: '8px', padding: '12px 4px', textAlign: 'center' }}>
                          <div style={{ fontSize: '20px', marginBottom: '4px' }}>😞</div>
                          <Text size={2} weight="bold" style={{ color: '#f43f5e' }}>{indianFormat.format(stat.emojis['bad'] || 0)}</Text>
                          <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '4px' }}>Bad</div>
                        </div>
                        <div style={{ background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', padding: '12px 4px', textAlign: 'center' }}>
                          <div style={{ fontSize: '20px', marginBottom: '4px' }}>😭</div>
                          <Text size={2} weight="bold" style={{ color: '#ef4444' }}>{indianFormat.format(stat.emojis['terrible'] || 0)}</Text>
                          <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '4px' }}>Terrible</div>
                        </div>
                      </div>

                      {/* Visit Page Link */}
                      <a
                        href={stat.url.startsWith('http') ? stat.url : `https://classgrid.in${stat.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 16px',
                          background: '#3b82f6',
                          color: '#fff',
                          borderRadius: '6px',
                          textDecoration: 'none',
                          fontSize: '13px',
                          fontWeight: 600,
                          transition: 'background 0.15s ease',
                          width: 'fit-content',
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#2563eb'}
                        onMouseOut={(e) => e.currentTarget.style.background = '#3b82f6'}
                      >
                        Visit Page ↗
                      </a>
                    </Stack>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div style={{ height: '40px' }}></div>
      </div>
    </div>
  )
}

export default FeedbackAnalytics
