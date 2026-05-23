"use client";

import { useCallback, useState } from "react";
import { Stack, Text, TextArea, Button, Card } from "@sanity/ui";
import { set, unset } from "sanity";
import type { ObjectInputProps } from "sanity";

/**
 * QuickTableInput — Paste pipe-separated text to auto-fill a richTable.
 *
 * Paste format:
 *   Header1 | Header2 | Header3
 *   Cell1   | Cell2   | Cell3
 *   Cell4   | Cell5   | Cell6
 *
 * First line becomes headers, remaining lines become rows.
 */
export function QuickTableInput(props: ObjectInputProps) {
  const { onChange, value, renderDefault } = props;
  const [quickText, setQuickText] = useState("");
  const [status, setStatus] = useState("");

  const handleParse = useCallback(() => {
    if (!quickText.trim()) {
      setStatus("⚠️ Paste some text first");
      return;
    }

    const lines = quickText
      .trim()
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length < 2) {
      setStatus("⚠️ Need at least 2 lines (1 header + 1 row)");
      return;
    }

    const headers = lines[0].split("|").map((h) => h.trim());
    const rows = lines.slice(1).map((line) => ({
      _type: "tableRow" as const,
      _key: Math.random().toString(36).slice(2, 10),
      cells: line.split("|").map((c) => c.trim()),
    }));

    onChange(
      set({
        ...((value as any) || {}),
        _type: "richTable",
        headers,
        rows,
      })
    );

    setStatus(`✅ Created table: ${headers.length} columns × ${rows.length} rows`);
    setQuickText("");
  }, [quickText, onChange, value]);

  return (
    <Stack space={4}>
      {/* Quick paste area */}
      <Card padding={3} radius={2} shadow={1} tone="primary">
        <Stack space={3}>
          <Text size={1} weight="bold">
            ⚡ Quick Table (paste pipe-separated text)
          </Text>
          <Text size={1} muted>
            Format: Header1 | Header2 | Header3 (first line = headers, rest = rows)
          </Text>
          <TextArea
            fontSize={1}
            padding={3}
            rows={5}
            placeholder={`Method | Cost | Speed | Proxy Risk\nManual Register | Free | 5-10 min | High\nQR Code | ₹0 | 30 sec | Medium\nApp-Based ERP | ₹50-100/yr | Instant | Low`}
            value={quickText}
            onChange={(e) => setQuickText(e.currentTarget.value)}
          />
          <Button
            text="Create Table from Text"
            tone="primary"
            onClick={handleParse}
            style={{ width: "fit-content" }}
          />
          {status && (
            <Text size={1} muted>
              {status}
            </Text>
          )}
        </Stack>
      </Card>

      {/* Default manual fields (headers[], rows[]) still available */}
      {renderDefault(props)}
    </Stack>
  );
}
