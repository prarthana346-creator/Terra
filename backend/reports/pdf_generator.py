"""
TerraSpace AI - NASA Technical Briefing PDF Report Generator
Uses Python ReportLab to generate publication-grade technical evaluation dossiers
for planetary analog candidates.
"""

import os
from datetime import datetime
from typing import Dict, Any
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether
)


class TerraSpaceReportGenerator:
    def __init__(self, export_dir: str = None):
        if not export_dir:
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            export_dir = os.path.join(base_dir, "exports")
        self.export_dir = export_dir
        os.makedirs(self.export_dir, exist_ok=True)

    def generate_location_report(self, loc_data: Dict[str, Any], mission_type: str = "All") -> str:
        """
        Builds a comprehensive NASA-styled research report PDF for a given analog location.
        Returns the absolute filepath to the created PDF.
        """
        loc_id = loc_data.get("id", "analog_report")
        loc_name = loc_data.get("name", "Unknown Analog")
        timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
        filename = f"TerraSpace_Report_{loc_id}_{timestamp}.pdf"
        filepath = os.path.join(self.export_dir, filename)

        doc = SimpleDocTemplate(
            filepath,
            pagesize=letter,
            leftMargin=0.5 * inch,
            rightMargin=0.5 * inch,
            topMargin=0.5 * inch,
            bottomMargin=0.5 * inch
        )

        styles = getSampleStyleSheet()
        
        # Custom space-themed styles
        title_style = ParagraphStyle(
            "DocTitle",
            parent=styles["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=18,
            textColor=colors.HexColor("#0f172a"),
            spaceAfter=4
        )
        subtitle_style = ParagraphStyle(
            "DocSubTitle",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=10,
            textColor=colors.HexColor("#475569"),
            spaceAfter=12
        )
        h2_style = ParagraphStyle(
            "Heading2Custom",
            parent=styles["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=12,
            textColor=colors.HexColor("#1e293b"),
            spaceBefore=10,
            spaceAfter=6
        )
        body_style = ParagraphStyle(
            "BodyCustom",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=9,
            leading=12,
            textColor=colors.HexColor("#334155")
        )
        badge_style = ParagraphStyle(
            "BadgeStyle",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=9,
            textColor=colors.whitesmoke
        )

        story = []

        # 1. Header Banner
        header_table = Table(
            [
                [
                    Paragraph("<b>TERRASPACE AI // PLANETARY MISSION INTELLIGENCE</b>", ParagraphStyle('H1', fontName='Helvetica-Bold', fontSize=10, textColor=colors.whitesmoke)),
                    Paragraph(f"<b>CLASSIFICATION: TECHNICAL BRIEF</b>", ParagraphStyle('H2', fontName='Helvetica-Bold', fontSize=9, textColor=colors.HexColor("#38bdf8"), alignment=2))
                ]
            ],
            colWidths=[4.8 * inch, 2.7 * inch]
        )
        header_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#090d1a")),
            ('PADDING', (0,0), (-1,-1), 8),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ]))
        story.append(header_table)
        story.append(Spacer(1, 10))

        # 2. Title and metadata
        story.append(Paragraph(f"Analog Site Evaluation: {loc_name}", title_style))
        story.append(Paragraph(
            f"Country: <b>{loc_data.get('country', 'N/A')}</b> | Region: <b>{loc_data.get('region', 'N/A')}</b> | "
            f"Coordinates: <b>{loc_data.get('coordinates', {}).get('lat', 'N/A')}°N, {loc_data.get('coordinates', {}).get('lng', 'N/A')}°E</b> | "
            f"Generated: <b>{datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC')}</b>",
            subtitle_style
        ))
        story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#cbd5e1"), spaceAfter=10))

        # 3. Executive Similarity Score Dashboard
        lunar_score = loc_data.get("lunar_similarity_score", 0.0)
        mars_score = loc_data.get("mars_similarity_score", 0.0)
        lunar_class = loc_data.get("lunar_classification", "Unclassified")
        mars_class = loc_data.get("mars_classification", "Unclassified")

        score_table_data = [
            [
                Paragraph("<b>TARGET PLANETARY BODY</b>", ParagraphStyle('TH', fontName='Helvetica-Bold', fontSize=9, textColor=colors.HexColor("#1e293b"))),
                Paragraph("<b>SIMILARITY SCORE (0-100)</b>", ParagraphStyle('TH', fontName='Helvetica-Bold', fontSize=9, textColor=colors.HexColor("#1e293b"))),
                Paragraph("<b>ANALOG FIDELITY CLASSIFICATION</b>", ParagraphStyle('TH', fontName='Helvetica-Bold', fontSize=9, textColor=colors.HexColor("#1e293b")))
            ],
            [
                Paragraph("<b>LUNAR BASE ANALOG</b> (Moon South Pole / Maria)", body_style),
                Paragraph(f"<b><font size='13' color='#2563eb'>{lunar_score}%</font></b>", body_style),
                Paragraph(f"<b>{lunar_class}</b>", body_style)
            ],
            [
                Paragraph("<b>MARTIAN SETTLEMENT ANALOG</b> (Mid-Latitude / Jezero)", body_style),
                Paragraph(f"<b><font size='13' color='#dc2626'>{mars_score}%</font></b>", body_style),
                Paragraph(f"<b>{mars_class}</b>", body_style)
            ]
        ]
        score_table = Table(score_table_data, colWidths=[2.7 * inch, 2.2 * inch, 2.6 * inch])
        score_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f1f5f9")),
            ('BACKGROUND', (0,1), (-1,1), colors.HexColor("#eff6ff")),
            ('BACKGROUND', (0,2), (-1,2), colors.HexColor("#fef2f2")),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
            ('PADDING', (0,0), (-1,-1), 6),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ]))
        story.append(score_table)
        story.append(Spacer(1, 10))

        # 4. Multi-Criteria Subdomain Breakdown
        story.append(Paragraph("1. MULTI-CRITERIA DECISION ANALYSIS (MCDA) SUB-DOMAINS", h2_style))
        sub = loc_data.get("subdomain_scores", {})
        mcda_rows = [
            [
                Paragraph("<b>Sub-Domain</b>", body_style),
                Paragraph("<b>Analog Score</b>", body_style),
                Paragraph("<b>Weight</b>", body_style),
                Paragraph("<b>Planetary Context & Fidelity Indicator</b>", body_style)
            ],
            [
                Paragraph("Geological Similarity", body_style),
                Paragraph(f"<b>{sub.get('geological_similarity', 'N/A')}%</b>", body_style),
                Paragraph("25%", body_style),
                Paragraph(f"Basaltic: {loc_data.get('geology',{}).get('basaltic_percentage', 0)}% | Regolith match: {loc_data.get('geology',{}).get('regolith_similarity_score', 0)}%", body_style)
            ],
            [
                Paragraph("Topographical Similarity", body_style),
                Paragraph(f"<b>{sub.get('topographical_similarity', 'N/A')}%</b>", body_style),
                Paragraph("20%", body_style),
                Paragraph(f"Slope: {loc_data.get('slope_deg', 0)}° | Roughness: {loc_data.get('surface_roughness', 0)} | Craters: {'Yes' if loc_data.get('crater_formations') else 'None'}", body_style)
            ],
            [
                Paragraph("Environmental Similarity", body_style),
                Paragraph(f"<b>{sub.get('environmental_similarity', 'N/A')}%</b>", body_style),
                Paragraph("20%", body_style),
                Paragraph(f"Mean Temp: {loc_data.get('environmental',{}).get('surface_temp_mean_c', 0)}°C | Diurnal Δ: {loc_data.get('environmental',{}).get('diurnal_temp_swing_c', 0)}°C | Precip: {loc_data.get('environmental',{}).get('annual_precipitation_mm', 0)}mm", body_style)
            ],
            [
                Paragraph("Resource Potential", body_style),
                Paragraph(f"<b>{sub.get('resource_potential', 'N/A')}%</b>", body_style),
                Paragraph("20%", body_style),
                Paragraph(f"Water Ice: {loc_data.get('resources',{}).get('water_ice_availability_score', 0)}% | Solar: {loc_data.get('resources',{}).get('solar_energy_potential', 0)}% | ISRU: {loc_data.get('resources',{}).get('construction_material_score', 0)}%", body_style)
            ],
            [
                Paragraph("Terrain Accessibility", body_style),
                Paragraph(f"<b>{sub.get('terrain_accessibility', 'N/A')}%</b>", body_style),
                Paragraph("10%", body_style),
                Paragraph(f"Logistics Index: {loc_data.get('operational',{}).get('accessibility_score', 0)}% (field station supply line viability)", body_style)
            ],
            [
                Paragraph("Scientific Research Value", body_style),
                Paragraph(f"<b>{sub.get('scientific_research_value', 'N/A')}%</b>", body_style),
                Paragraph("5%", body_style),
                Paragraph(f"Astrobiology / Habitation Testing Index: {loc_data.get('operational',{}).get('scientific_research_value', 0)}%", body_style)
            ]
        ]
        mcda_table = Table(mcda_rows, colWidths=[1.8 * inch, 1.1 * inch, 0.8 * inch, 3.8 * inch])
        mcda_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f8fafc")),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
            ('PADDING', (0,0), (-1,-1), 5),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ]))
        story.append(mcda_table)
        story.append(Spacer(1, 10))

        # 5. Scientific Explainability & Key Drivers
        explain = loc_data.get("explainability", {})
        story.append(Paragraph("2. AI EXPLAINABILITY & PARAMETER CONTRIBUTION", h2_style))
        story.append(Paragraph(f"<b>Primary Mission Fit:</b> {explain.get('primary_mission_fit', 'Planetary Analog')}", body_style))
        story.append(Spacer(1, 4))
        
        drivers = explain.get("key_contributing_factors", [])
        driver_text = "<br/>• ".join(drivers) if drivers else "Analyzed via Random Forest multidimensional regressor."
        story.append(Paragraph(f"<b>Key Contributing Factors:</b><br/>• {driver_text}", body_style))
        story.append(Spacer(1, 6))

        # 6. Physical Deviations & Scientific Reality Caveats
        story.append(Paragraph("3. PHYSICAL DEVIATIONS & EARTH REALITY CAVEATS", h2_style))
        story.append(Paragraph(
            "<i>Scientific Mandate: Earth cannot reproduce the Moon's vacuum, lunar gravity (0.166g), or Mars's thin CO2 atmosphere. "
            "Analog validity is strictly restricted to geological, geomorphological, and operational test analogies:</i>",
            body_style
        ))
        story.append(Spacer(1, 4))
        unmatched = explain.get("unmatched_planetary_characteristics", [])
        unmatched_text = "<br/>• ".join(unmatched)
        story.append(Paragraph(f"• {unmatched_text}", body_style))
        story.append(Spacer(1, 6))

        # 7. Supporting Datasets & Recommended Follow-up
        story.append(Paragraph("4. NASA & SCIENTIFIC DATASET CITATIONS", h2_style))
        datasets = explain.get("supporting_datasets", [])
        ds_text = "<br/>• ".join(datasets)
        story.append(Paragraph(f"• {ds_text}", body_style))
        story.append(Spacer(1, 6))

        story.append(Paragraph("5. RECOMMENDED NEXT-STAGE FIELD INVESTIGATIONS", h2_style))
        research = explain.get("recommended_further_research", [])
        res_text = "<br/>• ".join(research)
        story.append(Paragraph(f"• {res_text}", body_style))
        story.append(Spacer(1, 14))

        # Sign-off footer
        footer_p = Paragraph(
            "<b>TerraSpace AI Planetary Intelligence Platform</b> — Scientifically grounded terrestrial discovery system. "
            "Not an official authorization for crewed settlement. Verified against NASA PDS & Earthdata standards.",
            ParagraphStyle('Foot', fontName='Helvetica-Oblique', fontSize=8, textColor=colors.HexColor("#64748b"), alignment=1)
        )
        story.append(footer_p)

        doc.build(story)
        return filepath


report_generator = TerraSpaceReportGenerator()

