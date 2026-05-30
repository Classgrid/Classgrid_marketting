import React, { useEffect, useState, useMemo } from 'react'
import { useClient } from 'sanity'
import { Card, Text, Box, Flex, Stack, Heading, Badge, Spinner, Grid } from '@sanity/ui'

export function FeedbackAnalytics() {
  const client = useClient({ apiVersion: '2024-05-30' })
  const indianFormat = new Intl.NumberFormat('en-IN')
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetches up to the 40,000 most recent feedback entries total
    client.fetch(`*[_type == "websiteFeedback"] | order(createdAt desc)[0...40000]`).then((res) => {
      setData(res)
      setLoading(false)
    })
  }, [client])

  const stats = useMemo(() => {
    if (!data.length) return []
    
    // Group by pageUrl
    const groups: Record<string, any> = {}
    
    data.forEach(item => {
      const url = item.pageUrl || 'Unknown'
      if (!groups[url]) {
        groups[url] = { url, total: 0, comments: 0, emojis: { '🤩': 0, '😐': 0, '😞': 0, '😭': 0 } }
      }
      
      groups[url].total++
      if (item.comment) groups[url].comments++
      if (item.reaction) {
        groups[url].emojis[item.reaction] = (groups[url].emojis[item.reaction] || 0) + 1
      }
    })
    
    return Object.values(groups).sort((a, b) => b.total - a.total)
  }, [data])

  if (loading) {
    return (
      <Flex align="center" justify="center" style={{ height: '100%', minHeight: '400px' }}>
        <Spinner />
      </Flex>
    )
  }

  const totalFeedbacks = data.length
  const uniquePages = stats.length
  const mostReactedPage = stats.length > 0 ? stats[0] : null
  const highestRatedPage = [...stats].sort((a, b) => (b.emojis['🤩'] || 0) - (a.emojis['🤩'] || 0))[0]
  const lowestRatedPage = [...stats].sort((a, b) => (b.emojis['😭'] || 0) - (a.emojis['😭'] || 0))[0]

  return (
    <Card padding={4} overflow="auto" style={{ height: '100%', minHeight: '100vh', boxSizing: 'border-box' }}>
      <Stack space={5} style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Box>
          <Heading as="h1">Feedback Analytics</Heading>
          <Text muted marginTop={2}>Aggregated website feedback statistics by page. Identify which pages perform the best and which need improvement.</Text>
        </Box>

        <Grid columns={[1, 1, 3]} gap={4}>
          <Card padding={4} shadow={1} radius={2} tone="primary">
            <Text size={1} weight="medium">Total Feedbacks</Text>
            <Flex align="flex-end" gap={2} marginTop={3}>
              <Heading size={5}>{indianFormat.format(totalFeedbacks)}</Heading>
              <Text muted size={1} style={{ paddingBottom: '4px' }}>across {indianFormat.format(uniquePages)} pages</Text>
            </Flex>
            {mostReactedPage && (
              <Text size={1} muted marginTop={3}>
                Most active: <strong>{mostReactedPage.url}</strong> ({indianFormat.format(mostReactedPage.total)})
              </Text>
            )}
          </Card>
          
          <Card padding={4} shadow={1} radius={2} tone="positive">
            <Text size={1} weight="medium">Most Loved Page 🤩</Text>
            <Heading size={2} marginTop={3} textOverflow="ellipsis" style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
              {highestRatedPage && highestRatedPage.emojis['🤩'] > 0 ? highestRatedPage.url : 'No data'}
            </Heading>
            {highestRatedPage && highestRatedPage.emojis['🤩'] > 0 && (
              <Text size={1} muted marginTop={3}>{indianFormat.format(highestRatedPage.emojis['🤩'])} awesome ratings</Text>
            )}
          </Card>
          
          <Card padding={4} shadow={1} radius={2} tone="critical">
            <Text size={1} weight="medium">Needs Improvement 😭</Text>
            <Heading size={2} marginTop={3} textOverflow="ellipsis" style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
              {lowestRatedPage && lowestRatedPage.emojis['😭'] > 0 ? lowestRatedPage.url : 'No data'}
            </Heading>
            {lowestRatedPage && lowestRatedPage.emojis['😭'] > 0 && (
              <Text size={1} muted marginTop={3}>{indianFormat.format(lowestRatedPage.emojis['😭'])} terrible ratings</Text>
            )}
          </Card>
        </Grid>
        
        <Box marginTop={2}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--card-border-color)' }}>
                <th style={{ padding: '12px 16px' }}>Page URL</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Total Feedbacks</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Comments</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>🤩 Awesome</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>😐 Okay</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>😞 Bad</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>😭 Terrible</th>
              </tr>
            </thead>
            <tbody>
              {stats.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: '24px 16px', textAlign: 'center' }}>
                    <Text muted>No feedback data available.</Text>
                  </td>
                </tr>
              )}
              {stats.map((stat, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--card-border-color)' }}>
                  <td style={{ padding: '12px 16px', maxWidth: '300px', wordBreak: 'break-all' }}>
                    <Text size={1} weight="semibold">{stat.url}</Text>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <Badge tone="primary">{indianFormat.format(stat.total)}</Badge>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <Badge tone="default">{indianFormat.format(stat.comments)}</Badge>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}><Text>{indianFormat.format(stat.emojis['🤩'] || 0)}</Text></td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}><Text>{indianFormat.format(stat.emojis['😐'] || 0)}</Text></td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}><Text>{indianFormat.format(stat.emojis['😞'] || 0)}</Text></td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}><Text>{indianFormat.format(stat.emojis['😭'] || 0)}</Text></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Stack>
    </Card>
  )
}
