from __future__ import annotations

import html
import re
import textwrap
from pathlib import Path

from pypdf import PdfReader
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    Flowable,
    HRFlowable,
    PageBreak,
    Paragraph,
    Preformatted,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


SOURCE = Path(
    r"C:\Users\nikhi\.gemini\antigravity\brain\32da0002-c32d-4419-91f5-1d672dc18ea1\laser_tripwire_report.md.resolved"
)
OUTPUT = Path(r"C:\Users\nikhi\OneDrive\Documents\classgrid_marketting\laser_tripwire_report.pdf")


PAGE_WIDTH, PAGE_HEIGHT = A4
MARGIN = 0.58 * inch
CONTENT_WIDTH = PAGE_WIDTH - (2 * MARGIN)


def register_fonts() -> None:
    font_dir = Path(r"C:\Windows\Fonts")
    pdfmetrics.registerFont(TTFont("Arial", font_dir / "arial.ttf"))
    pdfmetrics.registerFont(TTFont("Arial-Bold", font_dir / "arialbd.ttf"))
    pdfmetrics.registerFont(TTFont("Arial-Italic", font_dir / "ariali.ttf"))
    pdfmetrics.registerFont(TTFont("Consolas", font_dir / "consola.ttf"))
    pdfmetrics.registerFont(TTFont("Consolas-Bold", font_dir / "consolab.ttf"))


class ImagePlaceholder(Flowable):
    def __init__(self, title: str, subtitle: str = "", height: float = 1.7 * inch):
        super().__init__()
        self.width = CONTENT_WIDTH
        self.height = height
        self.title = title
        self.subtitle = subtitle

    def draw(self) -> None:
        canvas = self.canv
        canvas.saveState()
        canvas.setStrokeColor(colors.HexColor("#94A3B8"))
        canvas.setLineWidth(1)
        canvas.setDash(5, 4)
        canvas.roundRect(0, 0, self.width, self.height, 6, stroke=1, fill=0)
        canvas.setDash()
        canvas.setFillColor(colors.HexColor("#E2E8F0"))
        canvas.rect(1, 1, self.width - 2, self.height - 2, stroke=0, fill=1)
        canvas.setFillColor(colors.HexColor("#334155"))
        canvas.setFont("Arial-Bold", 11)
        canvas.drawCentredString(self.width / 2, self.height / 2 + 8, self.title)
        if self.subtitle:
            canvas.setFillColor(colors.HexColor("#64748B"))
            canvas.setFont("Arial", 8.5)
            canvas.drawCentredString(self.width / 2, self.height / 2 - 9, self.subtitle)
        canvas.restoreState()


class QRPlaceholder(Flowable):
    def __init__(self):
        super().__init__()
        self.width = CONTENT_WIDTH
        self.height = 2.55 * inch

    def draw(self) -> None:
        canvas = self.canv
        canvas.saveState()
        size = 1.6 * inch
        x = (self.width - size) / 2
        y = 0.68 * inch
        canvas.setStrokeColor(colors.HexColor("#0F172A"))
        canvas.setLineWidth(1.1)
        canvas.setDash(5, 4)
        canvas.rect(x, y, size, size, stroke=1, fill=0)
        canvas.setDash()
        canvas.setFillColor(colors.HexColor("#F8FAFC"))
        canvas.rect(x + 1, y + 1, size - 2, size - 2, stroke=0, fill=1)
        canvas.setFillColor(colors.HexColor("#475569"))
        canvas.setFont("Arial-Bold", 10)
        canvas.drawCentredString(self.width / 2, y + size / 2 + 5, "QR CODE PLACEHOLDER")
        canvas.setFont("Arial", 8)
        canvas.drawCentredString(self.width / 2, y + size / 2 - 10, "Supabase redirect URL pending")
        canvas.setFont("Arial", 9)
        canvas.setFillColor(colors.HexColor("#334155"))
        canvas.drawString(0, 0.25 * inch, "Supabase image/video URL: ________________________________________________")
        canvas.restoreState()


COMPONENTS = [
    ("Arduino Uno R3", "Microcontroller board", "arduino"),
    ("Laser Diode", "650nm red beam source", "laser"),
    ("LDR Sensor", "Detects beam brightness", "ldr"),
    ("10kΩ Resistor", "Voltage divider pull-down", "resistor10"),
    ("220Ω Resistors", "LED current limiters", "resistor220"),
    ("Buzzer", "Audio alarm output", "buzzer"),
    ("Red LED", "Alarm/tripped indicator", "redled"),
    ("Green LED", "Safe/armed indicator", "greenled"),
    ("Breadboard", "Solderless prototype base", "breadboard"),
    ("Jumper Wires + Power", "Connections and 9V/USB supply", "wires"),
]


class ComponentGallery(Flowable):
    def __init__(self):
        super().__init__()
        self.width = CONTENT_WIDTH
        self.height = 6.95 * inch

    def draw(self) -> None:
        canvas = self.canv
        canvas.saveState()
        card_w = (self.width - 0.18 * inch) / 2
        card_h = 1.18 * inch
        gap_x = 0.18 * inch
        gap_y = 0.17 * inch
        icon_w = 0.86 * inch
        for index, (name, desc, kind) in enumerate(COMPONENTS):
            col = index % 2
            row = index // 2
            x = col * (card_w + gap_x)
            y = self.height - (row + 1) * card_h - row * gap_y
            canvas.setFillColor(colors.white)
            canvas.setStrokeColor(colors.HexColor("#CBD5E1"))
            canvas.setLineWidth(0.75)
            canvas.roundRect(x, y, card_w, card_h, 6, stroke=1, fill=1)
            draw_component_icon(canvas, kind, x + 0.12 * inch, y + 0.16 * inch, icon_w, card_h - 0.32 * inch)
            canvas.setFillColor(colors.HexColor("#0F172A"))
            canvas.setFont("Arial-Bold", 10)
            canvas.drawString(x + icon_w + 0.24 * inch, y + card_h - 0.42 * inch, name)
            canvas.setFillColor(colors.HexColor("#475569"))
            canvas.setFont("Arial", 8.1)
            canvas.drawString(x + icon_w + 0.24 * inch, y + card_h - 0.68 * inch, desc)
        canvas.restoreState()


def draw_component_icon(canvas, kind: str, x: float, y: float, w: float, h: float) -> None:
    if kind == "arduino":
        canvas.setFillColor(colors.HexColor("#0F766E"))
        canvas.roundRect(x + 5, y + 6, w - 10, h - 12, 8, stroke=0, fill=1)
        canvas.setFillColor(colors.HexColor("#CCFBF1"))
        for i in range(7):
            canvas.circle(x + 14 + i * 6, y + h - 15, 1.6, stroke=0, fill=1)
            canvas.circle(x + 14 + i * 6, y + 14, 1.6, stroke=0, fill=1)
        canvas.setFillColor(colors.HexColor("#134E4A"))
        canvas.rect(x + 24, y + 24, 18, 15, stroke=0, fill=1)
        canvas.setFillColor(colors.HexColor("#A7F3D0"))
        canvas.circle(x + w - 20, y + h - 20, 7, stroke=0, fill=1)
        return

    if kind == "laser":
        canvas.setFillColor(colors.HexColor("#334155"))
        canvas.roundRect(x + 8, y + h / 2 - 9, 34, 18, 8, stroke=0, fill=1)
        canvas.setFillColor(colors.HexColor("#FBBF24"))
        canvas.rect(x + 36, y + h / 2 - 9, 8, 18, stroke=0, fill=1)
        canvas.setStrokeColor(colors.HexColor("#EF4444"))
        canvas.setLineWidth(2.2)
        canvas.line(x + 46, y + h / 2, x + w - 6, y + h / 2)
        canvas.setLineWidth(0.8)
        canvas.line(x + 48, y + h / 2 + 5, x + w - 10, y + h / 2 + 10)
        canvas.line(x + 48, y + h / 2 - 5, x + w - 10, y + h / 2 - 10)
        return

    if kind == "ldr":
        canvas.setFillColor(colors.HexColor("#FDE68A"))
        canvas.setStrokeColor(colors.HexColor("#92400E"))
        canvas.circle(x + w / 2, y + h / 2, 23, stroke=1, fill=1)
        canvas.setStrokeColor(colors.HexColor("#92400E"))
        canvas.setLineWidth(1.4)
        zig_y = y + h / 2
        points = [(x + 24, zig_y), (x + 31, zig_y + 7), (x + 38, zig_y - 7), (x + 45, zig_y + 7), (x + 52, zig_y - 7), (x + 59, zig_y)]
        for start, end in zip(points, points[1:]):
            canvas.line(start[0], start[1], end[0], end[1])
        canvas.setStrokeColor(colors.HexColor("#64748B"))
        canvas.line(x + w / 2 - 10, y + 6, x + w / 2 - 10, y + 22)
        canvas.line(x + w / 2 + 10, y + 6, x + w / 2 + 10, y + 22)
        return

    if kind in {"resistor10", "resistor220"}:
        canvas.setStrokeColor(colors.HexColor("#64748B"))
        canvas.setLineWidth(2)
        canvas.line(x + 5, y + h / 2, x + 18, y + h / 2)
        canvas.line(x + w - 18, y + h / 2, x + w - 5, y + h / 2)
        canvas.setFillColor(colors.HexColor("#FDE68A"))
        canvas.setStrokeColor(colors.HexColor("#92400E"))
        canvas.roundRect(x + 18, y + h / 2 - 11, w - 36, 22, 10, stroke=1, fill=1)
        band_colors = (
            [colors.HexColor("#7C2D12"), colors.black, colors.HexColor("#F59E0B")]
            if kind == "resistor10"
            else [colors.HexColor("#EF4444"), colors.HexColor("#EF4444"), colors.HexColor("#7C2D12")]
        )
        for offset, color in zip([28, 39, 50], band_colors):
            canvas.setFillColor(color)
            canvas.rect(x + offset, y + h / 2 - 10, 4, 20, stroke=0, fill=1)
        return

    if kind == "buzzer":
        canvas.setFillColor(colors.HexColor("#111827"))
        canvas.circle(x + w / 2, y + h / 2, 25, stroke=0, fill=1)
        canvas.setFillColor(colors.HexColor("#F8FAFC"))
        canvas.circle(x + w / 2, y + h / 2, 9, stroke=0, fill=1)
        canvas.setStrokeColor(colors.HexColor("#64748B"))
        canvas.line(x + w / 2 - 12, y + 7, x + w / 2 - 12, y + 21)
        canvas.line(x + w / 2 + 12, y + 7, x + w / 2 + 12, y + 21)
        return

    if kind in {"redled", "greenled"}:
        led_color = colors.HexColor("#EF4444") if kind == "redled" else colors.HexColor("#22C55E")
        canvas.setFillColor(led_color)
        canvas.circle(x + w / 2, y + h / 2 + 5, 22, stroke=0, fill=1)
        canvas.setFillColor(colors.Color(1, 1, 1, alpha=0.35))
        canvas.circle(x + w / 2 - 8, y + h / 2 + 13, 6, stroke=0, fill=1)
        canvas.setStrokeColor(colors.HexColor("#64748B"))
        canvas.setLineWidth(1.4)
        canvas.line(x + w / 2 - 8, y + 8, x + w / 2 - 8, y + 28)
        canvas.line(x + w / 2 + 8, y + 8, x + w / 2 + 8, y + 28)
        return

    if kind == "breadboard":
        canvas.setFillColor(colors.HexColor("#F8FAFC"))
        canvas.setStrokeColor(colors.HexColor("#94A3B8"))
        canvas.roundRect(x + 6, y + 8, w - 12, h - 16, 7, stroke=1, fill=1)
        canvas.setStrokeColor(colors.HexColor("#EF4444"))
        canvas.line(x + 12, y + h - 16, x + w - 12, y + h - 16)
        canvas.setStrokeColor(colors.HexColor("#2563EB"))
        canvas.line(x + 12, y + 16, x + w - 12, y + 16)
        canvas.setFillColor(colors.HexColor("#94A3B8"))
        for row in range(4):
            for col in range(8):
                canvas.circle(x + 17 + col * 6, y + 27 + row * 6, 1.1, stroke=0, fill=1)
        return

    if kind == "wires":
        canvas.setStrokeColor(colors.HexColor("#EF4444"))
        canvas.setLineWidth(3)
        canvas.bezier(x + 8, y + 16, x + 25, y + h - 4, x + 45, y + 4, x + w - 10, y + h - 16)
        canvas.setStrokeColor(colors.HexColor("#2563EB"))
        canvas.bezier(x + 10, y + h - 12, x + 28, y + 2, x + 45, y + h - 5, x + w - 9, y + 14)
        canvas.setFillColor(colors.HexColor("#111827"))
        canvas.roundRect(x + w - 28, y + h / 2 - 15, 20, 30, 4, stroke=0, fill=1)
        canvas.setFillColor(colors.HexColor("#FBBF24"))
        canvas.rect(x + w - 23, y + h / 2 + 15, 10, 4, stroke=0, fill=1)
        return


def clean_inline_math(text: str) -> str:
    replacements = {
        r"\times": "x",
        r"\approx": "approximately",
        r"\Omega": "ohm",
        r"\text": "",
        r"\left": "",
        r"\right": "",
        r"\,": " ",
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    text = re.sub(r"\\frac\{([^{}]+)\}\{([^{}]+)\}", r"(\1 / \2)", text)
    text = re.sub(r"\{([^{}]+)\}", r"\1", text)
    text = text.replace("$", "")
    return text


def md_inline(text: str) -> str:
    text = clean_inline_math(text.strip())
    text = html.escape(text)
    text = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", text)
    text = re.sub(r"`([^`]+)`", r'<font name="Consolas">\1</font>', text)

    def link_repl(match: re.Match[str]) -> str:
        label = match.group(1)
        url = match.group(2)
        return f'<font color="#1D4ED8"><u>{label}</u></font> ({html.escape(url)})'

    return re.sub(r"\[([^\]]+)\]\(([^)]+)\)", link_repl, text)


def style_sheet() -> dict[str, ParagraphStyle]:
    base = getSampleStyleSheet()
    return {
        "title": ParagraphStyle(
            "title",
            parent=base["Title"],
            fontName="Arial-Bold",
            fontSize=25,
            leading=30,
            textColor=colors.HexColor("#0F172A"),
            alignment=TA_CENTER,
            spaceAfter=16,
        ),
        "subtitle": ParagraphStyle(
            "subtitle",
            parent=base["BodyText"],
            fontName="Arial",
            fontSize=11.5,
            leading=16,
            alignment=TA_CENTER,
            textColor=colors.HexColor("#334155"),
            spaceAfter=5,
        ),
        "h2": ParagraphStyle(
            "h2",
            parent=base["Heading2"],
            fontName="Arial-Bold",
            fontSize=15,
            leading=18,
            textColor=colors.HexColor("#0F172A"),
            spaceBefore=12,
            spaceAfter=8,
        ),
        "h3": ParagraphStyle(
            "h3",
            parent=base["Heading3"],
            fontName="Arial-Bold",
            fontSize=12.4,
            leading=15,
            textColor=colors.HexColor("#1E293B"),
            spaceBefore=9,
            spaceAfter=5,
        ),
        "body": ParagraphStyle(
            "body",
            parent=base["BodyText"],
            fontName="Arial",
            fontSize=9.7,
            leading=13.2,
            alignment=TA_JUSTIFY,
            textColor=colors.HexColor("#111827"),
            spaceAfter=6,
        ),
        "bullet": ParagraphStyle(
            "bullet",
            parent=base["BodyText"],
            fontName="Arial",
            fontSize=9.6,
            leading=13,
            leftIndent=18,
            firstLineIndent=-10,
            textColor=colors.HexColor("#111827"),
            spaceAfter=3,
        ),
        "small": ParagraphStyle(
            "small",
            parent=base["BodyText"],
            fontName="Arial",
            fontSize=8.4,
            leading=11,
            textColor=colors.HexColor("#475569"),
            spaceAfter=5,
        ),
        "code": ParagraphStyle(
            "code",
            parent=base["Code"],
            fontName="Consolas",
            fontSize=6.9,
            leading=8.4,
            textColor=colors.HexColor("#0F172A"),
            backColor=colors.HexColor("#F8FAFC"),
            borderColor=colors.HexColor("#CBD5E1"),
            borderWidth=0.5,
            borderPadding=6,
            leftIndent=0,
            rightIndent=0,
            spaceBefore=4,
            spaceAfter=8,
        ),
    }


def paragraph_block(lines: list[str], styles: dict[str, ParagraphStyle]) -> Paragraph:
    text = " ".join(line.strip().rstrip("  ") for line in lines)
    return Paragraph(md_inline(text), styles["body"])


def wrap_code(code: str, width: int = 98) -> str:
    wrapped: list[str] = []
    for line in code.splitlines():
        if len(line) <= width:
            wrapped.append(line)
            continue
        indent = len(line) - len(line.lstrip())
        continuation = " " * min(indent + 2, 14)
        wrapped.extend(
            textwrap.wrap(
                line,
                width=width,
                subsequent_indent=continuation,
                replace_whitespace=False,
                drop_whitespace=False,
            )
        )
    return "\n".join(wrapped)


def add_code_block(story: list, code: str, styles: dict[str, ParagraphStyle], lines_per_chunk: int = 42) -> None:
    wrapped_lines = wrap_code(code).splitlines()
    for start in range(0, len(wrapped_lines), lines_per_chunk):
        chunk = "\n".join(wrapped_lines[start : start + lines_per_chunk])
        story.append(Preformatted(chunk, styles["code"]))


def make_table(raw_rows: list[str], styles: dict[str, ParagraphStyle]) -> Table:
    rows: list[list[Paragraph]] = []
    for row in raw_rows:
        cells = [cell.strip() for cell in row.strip().strip("|").split("|")]
        if all(re.fullmatch(r":?-{3,}:?", cell) for cell in cells):
            continue
        rows.append([Paragraph(md_inline(cell), styles["small"]) for cell in cells])

    if rows and len(rows[0]) == 3:
        col_widths = [1.45 * inch, 0.5 * inch, CONTENT_WIDTH - (1.95 * inch)]
    else:
        col_widths = [CONTENT_WIDTH / len(rows[0])] * len(rows[0])

    table = Table(rows, colWidths=col_widths, repeatRows=1, hAlign="LEFT")
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#E2E8F0")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.HexColor("#0F172A")),
                ("FONTNAME", (0, 0), (-1, 0), "Arial-Bold"),
                ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#CBD5E1")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#F8FAFC")]),
                ("LEFTPADDING", (0, 0), (-1, -1), 5),
                ("RIGHTPADDING", (0, 0), (-1, -1), 5),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ]
        )
    )
    return table


def add_methodology_flow(story: list, styles: dict[str, ParagraphStyle]) -> None:
    steps = [
        "Start system",
        "Measure ambient light and calibrate",
        "Read analog value from LDR A0",
        "Decision: is the value below threshold?",
        "No: keep green LED on, alarm off, and continue monitoring",
        "Yes: turn green LED off, flash red LED, trigger buzzer, then await reset",
    ]
    flow_data = [[Paragraph(md_inline(step), styles["small"])] for step in steps]
    table = Table(flow_data, colWidths=[CONTENT_WIDTH], hAlign="LEFT")
    table.setStyle(
        TableStyle(
            [
                ("BOX", (0, 0), (-1, -1), 0.6, colors.HexColor("#CBD5E1")),
                ("INNERGRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#CBD5E1")),
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
                ("LEFTPADDING", (0, 0), (-1, -1), 9),
                ("RIGHTPADDING", (0, 0), (-1, -1), 9),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    story.append(table)
    story.append(Spacer(1, 8))


def parse_body(lines: list[str], start_index: int, styles: dict[str, ParagraphStyle]) -> list:
    story: list = []
    i = start_index
    last_heading = ""
    demonstration_placeholder_added = False

    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        if not stripped:
            i += 1
            continue

        if stripped == "---":
            story.append(Spacer(1, 6))
            story.append(HRFlowable(width="100%", thickness=0.6, color=colors.HexColor("#CBD5E1")))
            story.append(Spacer(1, 6))
            i += 1
            continue

        if stripped.startswith("## 12. Project Demonstration Video Link"):
            story.append(Paragraph(md_inline(stripped[3:]), styles["h2"]))
            story.append(
                Paragraph(
                    "Scan this area after the Supabase-hosted image or video URL is provided. "
                    "The QR code area is intentionally blank for now.",
                    styles["body"],
                )
            )
            story.append(QRPlaceholder())
            break

        if stripped.startswith("## "):
            heading_text = stripped[3:].strip()
            last_heading = heading_text
            if heading_text.startswith("8.") and not demonstration_placeholder_added:
                story.append(ImagePlaceholder("Project Demonstration Image Placeholder", "Add final working model or test photo here"))
                story.append(Spacer(1, 10))
                demonstration_placeholder_added = True
            story.append(Paragraph(md_inline(heading_text), styles["h2"]))
            i += 1
            continue

        if stripped.startswith("### "):
            last_heading = stripped[4:].strip()
            story.append(Paragraph(md_inline(last_heading), styles["h3"]))
            i += 1
            continue

        if stripped.startswith("```"):
            language = stripped.strip("`").strip().lower()
            code_lines: list[str] = []
            i += 1
            while i < len(lines) and not lines[i].strip().startswith("```"):
                code_lines.append(lines[i])
                i += 1
            i += 1
            if language == "mermaid":
                add_methodology_flow(story, styles)
            else:
                add_code_block(story, "\n".join(code_lines), styles)
                if "Circuit Connections" in last_heading:
                    story.append(ImagePlaceholder("Circuit / Assembly Image Placeholder", "Add wiring photo, schematic, or breadboard image here"))
                    story.append(Spacer(1, 10))
            continue

        if stripped.startswith("|"):
            table_lines: list[str] = []
            while i < len(lines) and lines[i].strip().startswith("|"):
                table_lines.append(lines[i])
                i += 1
            story.append(make_table(table_lines, styles))
            story.append(Spacer(1, 9))
            if "Component List" in last_heading:
                story.append(PageBreak())
                story.append(Paragraph("Component Visuals", styles["h2"]))
                story.append(
                    Paragraph(
                        "These visuals show every major part needed to build the laser tripwire security alarm.",
                        styles["body"],
                    )
                )
                story.append(ComponentGallery())
                story.append(PageBreak())
            continue

        bullet_match = re.match(r"^(\*|-)\s+(.*)", stripped)
        if bullet_match:
            story.append(Paragraph(md_inline(bullet_match.group(2)), styles["bullet"], bulletText="•"))
            i += 1
            continue

        number_match = re.match(r"^(\d+)\.\s+(.*)", stripped)
        if number_match:
            story.append(
                Paragraph(md_inline(number_match.group(2)), styles["bullet"], bulletText=f"{number_match.group(1)}.")
            )
            i += 1
            continue

        if stripped.startswith("$$"):
            if stripped.endswith("$$") and len(stripped) > 4:
                formula = stripped[2:-2].strip()
                story.append(Preformatted(wrap_code(clean_inline_math(formula), 84), styles["code"]))
                i += 1
                continue
            math_lines: list[str] = []
            i += 1
            while i < len(lines) and not lines[i].strip().startswith("$$"):
                math_lines.append(lines[i])
                i += 1
            i += 1
            story.append(Preformatted(wrap_code(clean_inline_math(" ".join(math_lines)), 84), styles["code"]))
            continue

        paragraph_lines = [line]
        i += 1
        while i < len(lines):
            peek = lines[i].strip()
            if not peek or peek == "---" or peek.startswith(("#", "```", "|")):
                break
            if re.match(r"^(\*|-)\s+", peek) or re.match(r"^\d+\.\s+", peek) or peek.startswith("$$"):
                break
            paragraph_lines.append(lines[i])
            i += 1
        story.append(paragraph_block(paragraph_lines, styles))

    return story


def make_cover(text: str, styles: dict[str, ParagraphStyle]) -> tuple[list, int]:
    lines = text.splitlines()
    title = lines[0].lstrip("# ").replace("Project Report:", "").strip()
    metadata: list[str] = []
    for line in lines[1:6]:
        if line.strip().startswith("**"):
            metadata.append(line.strip().replace("  ", ""))
    start_index = 0
    for index, line in enumerate(lines):
        if line.strip() == "---":
            start_index = index + 1
            break

    story: list = [
        Spacer(1, 0.36 * inch),
        Paragraph("Project Report", styles["subtitle"]),
        Paragraph(md_inline(title), styles["title"]),
        Spacer(1, 0.15 * inch),
    ]
    for item in metadata:
        story.append(Paragraph(md_inline(item), styles["subtitle"]))
    story.extend(
        [
            Spacer(1, 0.35 * inch),
            ImagePlaceholder("Project Image Placeholder", "Add your main project image here", height=2.15 * inch),
            Spacer(1, 0.45 * inch),
            Paragraph("Arduino-Based Laser Tripwire Security Alarm System", styles["subtitle"]),
            PageBreak(),
        ]
    )
    return story, start_index


def on_page(canvas, doc) -> None:
    canvas.saveState()
    canvas.setFont("Arial", 7.8)
    canvas.setFillColor(colors.HexColor("#64748B"))
    footer = f"Laser Tripwire Security Alarm System  |  Page {doc.page}"
    canvas.drawCentredString(PAGE_WIDTH / 2, 0.34 * inch, footer)
    canvas.restoreState()


def build_pdf() -> None:
    register_fonts()
    styles = style_sheet()
    text = SOURCE.read_text(encoding="utf-8")
    cover, start_index = make_cover(text, styles)
    body = parse_body(text.splitlines(), start_index, styles)

    doc = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=A4,
        rightMargin=MARGIN,
        leftMargin=MARGIN,
        topMargin=0.52 * inch,
        bottomMargin=0.62 * inch,
        title="Laser Tripwire Security Alarm System",
        author="Classgrid",
    )
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    doc.build(cover + body, onFirstPage=on_page, onLaterPages=on_page)

    reader = PdfReader(str(OUTPUT))
    print(f"PDF saved: {OUTPUT}")
    print(f"Pages: {len(reader.pages)}")
    print(f"Size: {OUTPUT.stat().st_size} bytes")


if __name__ == "__main__":
    build_pdf()
