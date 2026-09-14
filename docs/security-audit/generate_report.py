# -*- coding: utf-8 -*-
"""
EasyTraining - Relatório de Auditoria de Segurança de Aplicação
Gera relatório executivo em PDF e gráficos de apoio.
Compatível com ReportLab 5.0+ e Matplotlib 3.11+.
"""

import os
import sys
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np
import textwrap

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, 
    KeepTogether, PageBreak, Image, HRFlowable, Preformatted
)
from reportlab.pdfgen import canvas

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PDF_PATH = os.path.join(BASE_DIR, "relatorio-auditoria-seguranca.pdf")
CHART_SEVERITY_PATH = os.path.join(BASE_DIR, "severity_chart.png")
CHART_CATEGORY_PATH = os.path.join(BASE_DIR, "category_chart.png")

# Paleta Estrita OWASP / Dashboard
COLOR_CRITICA = colors.HexColor('#B91C1C')  # Vermelho Escuro
COLOR_ALTA = colors.HexColor('#EA580C')     # Laranja/Vermelho
COLOR_MEDIA = colors.HexColor('#D97706')    # Amarelo/Âmbar
COLOR_BAIXA = colors.HexColor('#2563EB')    # Azul
COLOR_FORTE = colors.HexColor('#059669')    # Verde Esmeralda

COLOR_DARK = colors.HexColor('#0F172A')     # Slate 900
COLOR_SLATE = colors.HexColor('#334155')    # Slate 700
COLOR_MUTED = colors.HexColor('#64748B')    # Slate 500
COLOR_LIGHT = colors.HexColor('#F8FAFC')    # Slate 50
COLOR_BORDER = colors.HexColor('#E2E8F0')   # Slate 200
COLOR_CARD = colors.HexColor('#F1F5F9')     # Slate 100
COLOR_WHITE = colors.HexColor('#FFFFFF')

def generate_charts():
    print("[1/3] Gerando gráficos com Matplotlib...")
    
    # Gráfico Donut de Severidade
    fig, ax = plt.subplots(figsize=(4.6, 2.9), subplot_kw=dict(aspect="equal"), dpi=300)
    labels = ['Alta (3)', 'Média (3)', 'Baixa (3)']
    sizes = [3, 3, 3]
    chart_colors = ['#EA580C', '#D97706', '#2563EB']
    explode = (0.04, 0.04, 0.04)

    wedges, texts, autotexts = ax.pie(
        sizes, 
        explode=explode, 
        labels=labels, 
        colors=chart_colors,
        autopct='%1.0f%%',
        startangle=140,
        pctdistance=0.76,
        wedgeprops=dict(width=0.42, edgecolor='white', linewidth=2)
    )

    for text in texts:
        text.set_color('#1E293B')
        text.set_fontsize(8)
        text.set_fontweight('bold')
    for autotext in autotexts:
        autotext.set_color('white')
        autotext.set_fontsize(8)
        autotext.set_fontweight('bold')

    ax.text(0, 0, 'Total\n9', ha='center', va='center', fontsize=11, fontweight='bold', color='#0F172A')
    ax.set_title("Distribuição por Severidade", fontsize=9.5, fontweight='bold', color='#0F172A', pad=10)
    plt.tight_layout()
    plt.savefig(CHART_SEVERITY_PATH, dpi=300, bbox_inches='tight', facecolor='white')
    plt.close()

    # Gráfico de Barras por Categoria
    fig, ax = plt.subplots(figsize=(5.4, 2.9), dpi=300)
    categories = [
        '1. Banco sem Tranca',
        '2. Permissão Navegador',
        '3. IDOR',
        '4. Chaves Expostas',
        '5. Inputs / XSS'
    ]
    
    alta = np.array([1, 0, 0, 0, 2])
    media = np.array([0, 1, 0, 2, 0])
    baixa = np.array([0, 1, 1, 1, 0])
    
    y_pos = np.arange(len(categories))
    bar_height = 0.52
    
    ax.barh(y_pos, alta, bar_height, label='Alta', color='#EA580C', edgecolor='white')
    ax.barh(y_pos, media, bar_height, left=alta, label='Média', color='#D97706', edgecolor='white')
    ax.barh(y_pos, baixa, bar_height, left=alta+media, label='Baixa', color='#2563EB', edgecolor='white')
    
    ax.set_yticks(y_pos)
    ax.set_yticklabels(categories, fontsize=7.5, fontweight='medium', color='#1E293B')
    ax.invert_yaxis()
    ax.set_xlabel('Quantidade de Vulnerabilidades', fontsize=8, fontweight='bold', color='#0F172A')
    ax.set_xlim(0, 3.2)
    ax.set_xticks([0, 1, 2, 3])
    ax.grid(axis='x', linestyle='--', alpha=0.4, color='#CBD5E1')
    ax.set_axisbelow(True)
    
    ax.legend(loc='lower right', frameon=True, fontsize=7.5, facecolor='#F8FAFC', edgecolor='#E2E8F0')
    ax.set_title("Vulnerabilidades por Categoria", fontsize=9.5, fontweight='bold', color='#0F172A', pad=10)
    
    for spine in ax.spines.values():
        spine.set_color('#E2E8F0')
        
    plt.tight_layout()
    plt.savefig(CHART_CATEGORY_PATH, dpi=300, bbox_inches='tight', facecolor='white')
    plt.close()
    print("Gráficos gerados com sucesso.")
class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_header_footer(num_pages)
            super().showPage()
        super().save()

    def draw_header_footer(self, page_count):
        if self._pageNumber == 1:
            return

        self.saveState()
        self.setFont("Helvetica", 7.5)
        self.setFillColor(COLOR_MUTED)

        # Cabeçalho Superior
        self.drawString(54, 842 - 36, "EASYTRAINING • RELATÓRIO DE AUDITORIA DE SEGURANÇA")
        self.drawRightString(595 - 54, 842 - 36, "SETEMBRO 2026")
        self.setStrokeColor(COLOR_BORDER)
        self.setLineWidth(0.6)
        self.line(54, 842 - 42, 595 - 54, 842 - 42)

        # Rodapé Inferior
        self.line(54, 45, 595 - 54, 45)
        self.drawString(54, 32, "CONFIDENCIAL — AUDITORIA DE CÓDIGO FONTE & ARQUITETURA")
        page_str = f"Página {self._pageNumber} de {page_count}"
        self.drawRightString(595 - 54, 32, page_str)

        self.restoreState()

def build_pdf():
    print("[2/3] Construindo estrutura do documento PDF...")
    
    USABLE_WIDTH = 487.27
    
    doc = SimpleDocTemplate(
        PDF_PATH,
        pagesize=A4,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()
    
    style_cover_title = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=23,
        leading=27,
        textColor=COLOR_DARK
    )
    
    style_cover_subtitle = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10.5,
        leading=14.5,
        textColor=COLOR_MUTED
    )
    
    style_h1 = ParagraphStyle(
        'SectionH1',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=13.5,
        leading=17.5,
        textColor=COLOR_DARK,
        spaceBefore=12,
        spaceAfter=7,
        keepWithNext=True
    )
    
    style_h2 = ParagraphStyle(
        'SectionH2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=13.5,
        textColor=COLOR_SLATE,
        spaceBefore=10,
        spaceAfter=5,
        keepWithNext=True
    )

    style_body = ParagraphStyle(
        'BodyCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=COLOR_SLATE
    )

    style_body_bold = ParagraphStyle(
        'BodyBoldCustom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=12,
        textColor=COLOR_DARK
    )

    style_code = ParagraphStyle(
        'CodeStyle',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=6.8,
        leading=8.5,
        textColor=COLOR_DARK
    )

    style_table_th = ParagraphStyle(
        'TableTH',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=COLOR_WHITE,
        alignment=0
    )

    style_table_td = ParagraphStyle(
        'TableTD',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=9.5,
        textColor=COLOR_DARK
    )

    style_chip_text = ParagraphStyle(
        'ChipText',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=9,
        textColor=COLOR_WHITE,
        alignment=1
    )

    story = []

    # CAPA PROFISSIONAL
    story.append(Spacer(1, 20))
    story.append(Paragraph("EASYTRAINING CURSOS PROFISSIONALIZANTES", ParagraphStyle(
        'CoverBrand', fontName='Helvetica-Bold', fontSize=10, leading=12, textColor=COLOR_FORTE
    )))
    story.append(Spacer(1, 14))
    story.append(Paragraph("RELATÓRIO DE AUDITORIA DE SEGURANÇA DE CÓDIGO", style_cover_title))
    story.append(Spacer(1, 8))
    story.append(Paragraph("Revisão Arquitetural em 5 Categorias Críticas de Segurança SaaS / Web", style_cover_subtitle))
    story.append(Spacer(1, 18))
    
    story.append(HRFlowable(width="100%", thickness=2.5, color=COLOR_DARK, spaceAfter=22))

    meta_data = [
        [Paragraph("<b>Aplicação Alvo:</b>", style_body), Paragraph("Plataforma Web EasyTraining (Next.js 16.3 / React 19 / Firestore)", style_body)],
        [Paragraph("<b>Ambiente & Stack:</b>", style_body), Paragraph("TypeScript 5.8, Tailwind CSS v4, Firebase Admin, Vercel Serverless", style_body)],
        [Paragraph("<b>Data de Emissão:</b>", style_body), Paragraph("14 de Setembro de 2026", style_body)],
        [Paragraph("<b>Escopo da Revisão:</b>", style_body), Paragraph("1. Banco sem Tranca | 2. Permissão no Navegador | 3. IDOR | 4. Chaves Expostas | 5. Inputs / XSS", style_body)],
        [Paragraph("<b>Responsável Técnico:</b>", style_body), Paragraph("Antigravity AI AppSec Core — Auditoria Automatizada & Estática", style_body)],
        [Paragraph("<b>Classificação:</b>", style_body), Paragraph("<font color='#B91C1C'><b>CONFIDENCIAL — PROPRIEDADE INTERNA</b></font>", style_body)],
        [Paragraph("<b>Status Geral:</b>", style_body), Paragraph("<font color='#EA580C'><b>9 Vulnerabilidades Mapeadas (3 Altas, 3 Médias, 3 Baixas)</b></font>", style_body)]
    ]
    meta_table = Table(meta_data, colWidths=[120, USABLE_WIDTH - 120])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), COLOR_CARD),
        ('BOX', (0,0), (-1,-1), 1, COLOR_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.5, COLOR_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 5.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5.5),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 20))

    verdict_text = (
        "<b>SUMÁRIO DO VEREDITO EXECUTIVO:</b><br/>"
        "A auditoria de código fonte identificou sólidos mecanismos de segurança nos fluxos centrais "
        "do back-end, notadamente na proteção rígida dos leads no Firestore via regras de segurança atômicas "
        "(LGPD-compliant), validação estrita de assinaturas HMAC-SHA256 para sessões administrativas e checagem "
        "binária de magic numbers contra uploads de arquivos maliciosos.<br/><br/>"
        "Entretanto, foram identificadas <b>3 vulnerabilidades de severidade ALTA</b> que exigem remediação prioritária: "
        "vazamento público do webhook de automação (n8n), bypass de sanitização HTML via regex com renderização "
        "no blog (dangerouslySetInnerHTML), e interpolação direta de parâmetros de configuração em scripts inline (Stored XSS)."
    )
    verdict_card = Table([[Paragraph(verdict_text, style_body)]], colWidths=[USABLE_WIDTH])
    verdict_card.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#FEF2F2')),
        ('BOX', (0,0), (-1,-1), 1.5, COLOR_ALTA),
        ('TOPPADDING', (0,0), (-1,-1), 9),
        ('BOTTOMPADDING', (0,0), (-1,-1), 9),
        ('LEFTPADDING', (0,0), (-1,-1), 11),
        ('RIGHTPADDING', (0,0), (-1,-1), 11),
    ]))
    story.append(verdict_card)

    story.append(PageBreak())

    # SEÇÃO 1: RESUMO EXECUTIVO & GRÁFICOS
    story.append(Paragraph("1. Resumo Executivo & Painel de Indicadores", style_h1))
    story.append(Paragraph(
        "A análise cobriu 21 rotas de API em <code>src/app/api/</code>, camadas de middleware, serviços de autenticação, "
        "regras do Firestore e renderizadores de interface. O resultado quantitativo consolidado está representado abaixo:",
        style_body
    ))
    story.append(Spacer(1, 10))

    chart_row = [
        [Image(CHART_SEVERITY_PATH, width=235, height=148),
         Image(CHART_CATEGORY_PATH, width=245, height=148)]
    ]
    chart_table = Table(chart_row, colWidths=[240, 247])
    chart_table.setStyle(TableStyle([
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(chart_table)
    story.append(Spacer(1, 12))
    # TABELA CONSOLIDADA DE ACHADOS
    story.append(Paragraph("Matriz Geral de Vulnerabilidades Encontradas", style_h2))
    
    table_headers = [
        Paragraph("<b>ID</b>", style_table_th),
        Paragraph("<b>Categoria</b>", style_table_th),
        Paragraph("<b>Severidade</b>", style_table_th),
        Paragraph("<b>Arquivo e Linha</b>", style_table_th),
        Paragraph("<b>Impacto Resumido</b>", style_table_th)
    ]

    def make_chip(text, bg_color):
        t = Table([[Paragraph(text, style_chip_text)]], colWidths=[54], rowHeights=[14])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), bg_color),
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('BOTTOMPADDING', (0,0), (-1,-1), 1),
            ('TOPPADDING', (0,0), (-1,-1), 1),
            ('LEFTPADDING', (0,0), (-1,-1), 0),
            ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ]))
        return t

    table_rows = [
        table_headers,
        [
            Paragraph("<b>C1-01</b>", style_table_td),
            Paragraph("1. Banco sem Tranca", style_table_td),
            make_chip("ALTA", COLOR_ALTA),
            Paragraph("<code>firestore.rules:13-16</code><br/><code>api/site-config:6-14</code>", style_table_td),
            Paragraph("Exposição pública de URL privada do webhook n8n (CRM/Telegram)", style_table_td)
        ],
        [
            Paragraph("<b>C2-01</b>", style_table_td),
            Paragraph("2. Permissão Navegador", style_table_td),
            make_chip("MÉDIA", COLOR_MEDIA),
            Paragraph("<code>authService.ts:145-167</code>", style_table_td),
            Paragraph("Dessincronização de sessão client/server no login Firebase Auth", style_table_td)
        ],
        [
            Paragraph("<b>C2-02</b>", style_table_td),
            Paragraph("2. Permissão Navegador", style_table_td),
            make_chip("BAIXA", COLOR_BAIXA),
            Paragraph("<code>src/middleware.ts:109</code>", style_table_td),
            Paragraph("Rotas <code>/api</code> isentas do middleware global de segurança", style_table_td)
        ],
        [
            Paragraph("<b>C3-01</b>", style_table_td),
            Paragraph("3. IDOR", style_table_td),
            make_chip("BAIXA", COLOR_BAIXA),
            Paragraph("<code>api/posts/[id]:13</code><br/><code>api/courses/[id]:13</code>", style_table_td),
            Paragraph("Falta de validação de formato do ID dinâmico da rota", style_table_td)
        ],
        [
            Paragraph("<b>C4-01</b>", style_table_td),
            Paragraph("4. Chaves Expostas", style_table_td),
            make_chip("MÉDIA", COLOR_MEDIA),
            Paragraph("<code>authService.ts:21-26</code>", style_table_td),
            Paragraph("Lista de e-mails administrativos exposta no bundle público client", style_table_td)
        ],
        [
            Paragraph("<b>C4-02</b>", style_table_td),
            Paragraph("4. Chaves Expostas", style_table_td),
            make_chip("MÉDIA", COLOR_MEDIA),
            Paragraph("<code>api/admin/login:37</code>", style_table_td),
            Paragraph("Comparação de senha não segura contra Timing Attacks", style_table_td)
        ],
        [
            Paragraph("<b>C4-03</b>", style_table_td),
            Paragraph("4. Chaves Expostas", style_table_td),
            make_chip("BAIXA", COLOR_BAIXA),
            Paragraph("<code>Git commit a3b21d2</code>", style_table_td),
            Paragraph("Credenciais de desenvolvimento em histórico antigo do Git", style_table_td)
        ],
        [
            Paragraph("<b>C5-01</b>", style_table_td),
            Paragraph("5. Inputs / XSS", style_table_td),
            make_chip("ALTA", COLOR_ALTA),
            Paragraph("<code>lib/security.ts:41-58</code><br/><code>PostDetailView.tsx:141</code>", style_table_td),
            Paragraph("Bypass de regex em rich text com <code>dangerouslySetInnerHTML</code>", style_table_td)
        ],
        [
            Paragraph("<b>C5-02</b>", style_table_td),
            Paragraph("5. Inputs / XSS", style_table_td),
            make_chip("ALTA", COLOR_ALTA),
            Paragraph("<code>src/app/layout.tsx:261, 281</code>", style_table_td),
            Paragraph("Stored XSS via injeção de scripts inline GA4/GTM não validados", style_table_td)
        ],
    ]

    findings_table = Table(table_rows, colWidths=[38, 95, 60, 148, 146])
    findings_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), COLOR_DARK),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOX', (0,0), (-1,-1), 1, COLOR_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.5, COLOR_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 4.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4.5),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [COLOR_WHITE, COLOR_LIGHT]),
    ]))
    story.append(findings_table)

    story.append(PageBreak())

    # SEÇÃO 2: PONTOS FORTES ENCONTRADOS
    story.append(Paragraph("2. Pontos Fortes & Controles Verificados", style_h1))
    story.append(Paragraph(
        "A auditoria verificou meticulosamente onde a aplicação já implementou padrões adequados de "
        "segurança defensiva em todas as 5 categorias analisadas:",
        style_body
    ))
    story.append(Spacer(1, 8))

    strengths = [
        ("1. Banco sem Tranca (Isolamento de Dados)",
         "<code>firestore.rules:20-24</code>",
         "A coleção crítica <code>/leads/{leadId}</code> possui bloqueio estrito contra leitura, alteração ou exclusão "
         "por clientes (<code>allow read, update, delete: if false;</code>). A criação pública exige formato string para nome e telefone. "
         "Nenhum visitante consegue enumerar dados de alunos cadastrados diretamente no Firestore."),
        
        ("2. Permissão no Navegador (Server Guards)",
         "Todas as 16 rotas de escrita em <code>src/app/api/</code>",
         "Todas as rotas de mutação administrativas (criação/edição de cursos, posts, gerenciamento de leads, IA, sincronização) "
         "executam verificação server-side obrigatória via <code>verifyAdminSession(request)</code> antes de qualquer operação no banco."),
        
        ("3. IDOR (Isolamento Horizontal)",
         "Arquitetura de Leads em <code>src/lib/leadsDb.ts</code>",
         "A plataforma opera em modelo single-tenant para gestão institucional. Não há exposição de endpoint público <code>GET /api/leads/[id]</code>. "
         "Alunos não possuem credenciais de acesso, eliminando vetores de vazamento horizontal entre estudantes."),
        
        ("4. Chaves & Segredos Criptográficos",
         "<code>src/lib/authServer.ts:4-10</code>",
         "A função <code>getAdminSessionSecret()</code> força que a chave de assinatura de sessão possua no mínimo 32 caracteres, "
         "interrompendo a execução com erro caso o ambiente esteja mal configurado. A chave privada do Firebase Admin "
         "normaliza escape de quebras de linha PEM sem armazenar segredos de fallback hardcoded no código ativo."),
        
        ("5. Inputs sem Tratamento (Prevenção de SVG XSS)",
         "<code>src/app/api/upload/route.ts:9-14</code>",
         "O upload de mídia rejeita categoricamente arquivos com extensão ou MIME type <code>image/svg+xml</code>, "
         "e valida magic numbers binários para formatos WebP, PNG, JPEG e GIF, impedindo a injeção de vetores SVG Stored XSS na raiz.")
    ]

    for cat_name, file_ref, desc in strengths:
        card_content = [
            [Paragraph(f"<font color='#059669'><b>PONTO FORTE — {cat_name}</b></font>", style_body_bold),
             Paragraph(f"<b>Verificado em:</b> {file_ref}", style_body)]
        ]
        card_t = Table(card_content, colWidths=[250, USABLE_WIDTH - 250])
        card_t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#ECFDF5')),
            ('LINEBELOW', (0,0), (-1,-1), 1, COLOR_FORTE),
            ('TOPPADDING', (0,0), (-1,-1), 3.5),
            ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
            ('LEFTPADDING', (0,0), (-1,-1), 7),
            ('RIGHTPADDING', (0,0), (-1,-1), 7),
        ]))
        
        body_t = Table([[Paragraph(desc, style_body)]], colWidths=[USABLE_WIDTH])
        body_t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), COLOR_LIGHT),
            ('BOX', (0,0), (-1,-1), 0.5, COLOR_BORDER),
            ('TOPPADDING', (0,0), (-1,-1), 5),
            ('BOTTOMPADDING', (0,0), (-1,-1), 5),
            ('LEFTPADDING', (0,0), (-1,-1), 7),
            ('RIGHTPADDING', (0,0), (-1,-1), 7),
        ]))
        
        story.append(card_t)
        story.append(body_t)
        story.append(Spacer(1, 6))

    story.append(PageBreak())
    # SEÇÃO 3: DETALHAMENTO TÉCNICO DAS VULNERABILIDADES
    story.append(Paragraph("3. Detalhamento Técnico das Vulnerabilidades", style_h1))
    story.append(Paragraph(
        "Abaixo estão documentadas as falhas identificadas, contendo arquivo e linha exatos, trecho vulnerável, "
        "vetor de exploração e o patch pronto para aplicação.",
        style_body
    ))
    story.append(Spacer(1, 8))

    def make_finding_box(fid, title, sev_text, sev_color, file_line, exploit_txt, vuln_code, fix_code):
        box_elements = []
        safe_exploit = exploit_txt.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
        safe_loc = file_line.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
        
        header_table = Table([
            [Paragraph(f"<b>{fid}: {title}</b>", style_body_bold),
             make_chip(sev_text, sev_color)]
        ], colWidths=[USABLE_WIDTH - 65, 65])
        header_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), COLOR_CARD),
            ('LINEBELOW', (0,0), (-1,-1), 1.5, sev_color),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
            ('LEFTPADDING', (0,0), (-1,-1), 7),
            ('RIGHTPADDING', (0,0), (-1,-1), 7),
        ]))
        box_elements.append(header_table)

        details = [
            [Paragraph(f"<b>Localização:</b> <code>{safe_loc}</code>", style_body)],
            [Paragraph(f"<b>Vetor de Ataque:</b> {safe_exploit}", style_body)],
            [Paragraph("<b>Código Vulnerável Atual:</b>", style_body_bold)],
            [Preformatted(vuln_code, style_code)],
            [Paragraph("<b>Correção Recomendada (Pronta para Aplicação):</b>", style_body_bold)],
            [Preformatted(fix_code, style_code)],
        ]
        details_table = Table(details, colWidths=[USABLE_WIDTH])
        details_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), COLOR_LIGHT),
            ('BOX', (0,0), (-1,-1), 0.5, COLOR_BORDER),
            ('TOPPADDING', (0,0), (-1,-1), 3.5),
            ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
            ('LEFTPADDING', (0,0), (-1,-1), 7),
            ('RIGHTPADDING', (0,0), (-1,-1), 7),
            ('BACKGROUND', (0,3), (0,3), colors.HexColor('#FEE2E2')),
            ('BACKGROUND', (0,5), (0,5), colors.HexColor('#ECFDF5')),
            ('BOX', (0,3), (0,3), 0.5, colors.HexColor('#FCA5A5')),
            ('BOX', (0,5), (0,5), 0.5, colors.HexColor('#6EE7B7')),
        ]))
        box_elements.append(details_table)
        box_elements.append(Spacer(1, 9))
        return KeepTogether(box_elements)

    # C1-01
    story.append(Paragraph("CATEGORIA 1: BANCO SEM TRANCA (Isolamento de Inquilino/Dono)", style_h2))
    story.append(make_finding_box(
        "C1-01",
        "Vazamento Público de n8nWebhookUrl via Firestore e API Aberta",
        "ALTA", COLOR_ALTA,
        "firestore.rules:13-16 e src/app/api/site-config/route.ts:6-14",
        "A regra do Firestore concede leitura irrestrita da coleção config para qualquer cliente sem autenticação. "
        "Concomitantemente, o endpoint GET /api/site-config retorna o objeto com n8nWebhookUrl sem filtragem. "
        "Isso expõe a URL privada do webhook com tokens de autenticação do n8n/Telegram/CRM.",
        "// firestore.rules:13-16\nmatch /config/{configId} {\n  allow read: if true;\n  allow write: if false;\n}",
        "// src/app/api/site-config/route.ts\nexport async function GET() {\n  const config = await getSiteConfigFromFirestore();\n  const { n8nWebhookUrl, ...publicConfig } = config as any;\n  return NextResponse.json(publicConfig);\n}\n\n// firestore.rules: Fechar leitura direta do cliente\nmatch /config/{configId} {\n  allow read, write: if false;\n}"
    ))

    # C2-01 & C2-02
    story.append(Paragraph("CATEGORIA 2: PERMISSÃO DEFINIDA NO NAVEGADOR", style_h2))
    story.append(make_finding_box(
        "C2-01",
        "Dessincronização de Sessão e Bypass Cosmético via LocalStorage no Firebase Auth",
        "MÉDIA", COLOR_MEDIA,
        "src/services/authService.ts:145-167",
        "No fallback via signInWithEmailAndPassword, o cliente salva o estado de autenticação no localStorage, "
        "mas não solicita a emissão do cookie HttpOnly admin_session assinado. A UI do painel abre, porém todas as "
        "chamadas às APIs administrativas falham com 401. Permite também forjar acesso visual via DevTools.",
        "// authService.ts:145-167\nconst userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, pass);\n// Salva no localStorage mas NÃO emite cookie no servidor\nlocalStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(sessionData));",
        "// Sincronizar sessão com a rota server-side para emissão do cookie HttpOnly:\nconst res = await fetch('/api/admin/login', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({ email: normalizedEmail, idToken: await fbUser.getIdToken() })\n});"
    ))

    story.append(make_finding_box(
        "C2-02",
        "Isenção Total das Rotas /api no Matcher de Segurança do Middleware",
        "BAIXA", COLOR_BAIXA,
        "src/middleware.ts:109",
        "O regex matcher do middleware ignora todas as rotas com prefixo api (?!api...). Apesar de cada handler atual "
        "conter verifyAdminSession, a falta de verificação perimetral remove a camada de Defesa em Profundidade.",
        "// src/middleware.ts:109\nmatcher: ['/((?!api|_next/static|_next/image|favicon.ico|manifest.json).*)'],",
        "// Adicionar guard perimetral no middleware para rotas de escrita administrativas:\nif (request.nextUrl.pathname.startsWith('/api/admin/') && \n    !request.nextUrl.pathname.startsWith('/api/admin/login')) {\n  const session = request.cookies.get('admin_session')?.value;\n  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });\n}"
    ))

    # C3-01
    story.append(Paragraph("CATEGORIA 3: IDOR (Insecure Direct Object Reference)", style_h2))
    story.append(make_finding_box(
        "C3-01",
        "Ausência de Validação de Formato de ID nas Rotas de Posts e Cursos",
        "BAIXA", COLOR_BAIXA,
        "src/app/api/posts/[id]/route.ts:13 e src/app/api/courses/[id]/route.ts:13",
        "A rota de leads sanitiza estritamente os IDs (/^[a-zA-Z0-9_-]{3,64}$/), enquanto posts e courses "
        "comparam strings brutas. Parâmetros malformados ou caracteres de controle podem gerar comportamentos inesperados.",
        "// src/app/api/posts/[id]/route.ts:13\nconst { id } = await params;\nconst post = posts.find(p => String(p.id) === String(id));",
        "// Validar formato estrito do ID:\nfunction isValidEntityId(id: string): boolean {\n  return /^[a-zA-Z0-9_-]{2,80}$/.test(id);\n}\nif (!isValidEntityId(id)) return NextResponse.json({ error: 'ID inválido' }, { status: 400 });"
    ))

    story.append(PageBreak())
    # C4-01 & C4-02 & C4-03
    story.append(Paragraph("CATEGORIA 4: CHAVES EXPOSTAS (Hardcode & Defaults)", style_h2))
    story.append(make_finding_box(
        "C4-01",
        "Exposição da Lista de E-mails de Administradores no Bundle Público do Cliente",
        "MÉDIA", COLOR_MEDIA,
        "src/services/authService.ts:21-26",
        "A lista ALLOWED_ADMIN_EMAILS é empacotada no JavaScript público do navegador, permitindo que atacantes "
        "conheçam as contas privilegiadas da instituição e executem ataques de spear-phishing e enumeração.",
        "// src/services/authService.ts:21-26\nexport const ALLOWED_ADMIN_EMAILS = [\n  'raccorreia@gmail.com',\n  'rac2digital@gmail.com',\n  'admin@easytraining.com.br',\n  'easytraining.cursos@gmail.com'\n];",
        "// Manter e-mails exclusivamente no back-end (authServer.ts):\n// O cliente apenas submete as credenciais para validação no servidor."
    ))

    story.append(make_finding_box(
        "C4-02",
        "Comparação de Senha Mestra Vulnerável a Timing Attack no Endpoint de Login",
        "MÉDIA", COLOR_MEDIA,
        "src/app/api/admin/login/route.ts:37",
        "A comparação de strings com === encerra no primeiro caractere divergente, abrindo margem para "
        "inferência da senha de administração via medição estatística de tempo de resposta da API.",
        "// src/app/api/admin/login/route.ts:37\nconst isMasterValid = password === masterPassword;",
        "// Utilizar comparação em tempo constante com timingSafeEqual:\nimport { timingSafeEqual } from 'crypto';\nconst passBuf = Buffer.from(password.padEnd(64, ' '));\nconst masterBuf = Buffer.from(masterPassword.padEnd(64, ' '));\nconst isMasterValid = password.length === masterPassword.length && \n                      timingSafeEqual(passBuf, masterBuf);"
    ))

    story.append(make_finding_box(
        "C4-03",
        "Resíduos de Credenciais Antigas de Desenvolvimento em Histórico do Git",
        "BAIXA", COLOR_BAIXA,
        "Git commit a3b21d2bb036b28327382fdeda30ad9e5cd5407e",
        "Commits anteriores registraram senhas de teste como admin123 e easytraining2026. "
        "Em caso de abertura do código ou vazamento do repositório, essas strings podem ser reutilizadas.",
        "// Commit a3b21d2b...\n- SENHA_PADRAO = 'admin123' / 'easytraining2026'",
        "// Ação de Higiene: Rotacionar todas as senhas de produção e higienizar histórico Git se o repositório for público."
    ))

    # C5-01 & C5-02
    story.append(Paragraph("CATEGORIA 5: INPUTS SEM TRATAMENTO (O Clássico Esquecido)", style_h2))
    story.append(make_finding_box(
        "C5-01",
        "Sanitização HTML Frágil por Regex e Stored XSS via dangerouslySetInnerHTML",
        "ALTA", COLOR_ALTA,
        "src/lib/security.ts:41-58 e src/components/blog/PostDetailView.tsx:141",
        "A sanitização por expressões regulares falha contra tags como iframe, embed, object e manipuladores de "
        "evento sem espaçamento tradicional (ex: <svg/onload=alert(1)>). O HTML é renderizado diretamente no navegador do leitor.",
        "// src/lib/security.ts:41-58\nreturn input.replace(/<script\\b[^<]*(?:(?!<\\/script>)<[^<]*)*<\\/script>/gi, '')\n  .replace(/\\son\\w+\\s*=\\s*(['\"]).*?\\1/gi, '') ...",
        "// Sanitização padrão indústria com isomorphic-dompurify:\nimport DOMPurify from 'isomorphic-dompurify';\nexport function sanitizeHtmlContent(input: unknown): string {\n  if (typeof input !== 'string') return '';\n  return DOMPurify.sanitize(input, {\n    ALLOWED_TAGS: ['p', 'b', 'i', 'em', 'strong', 'a', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'img', 'blockquote'],\n    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'target']\n  });\n}"
    ))

    story.append(make_finding_box(
        "C5-02",
        "Stored XSS via Interpolação de Strings Não Sanitizadas em Scripts Inline de GA4/GTM",
        "ALTA", COLOR_ALTA,
        "src/app/layout.tsx:261, 281",
        "Os identificadores gaId e gtmId são inseridos sem validação alfanumérica dentro de tags <script> inline. "
        "Um valor hostil salvo na configuração injeta código JavaScript arbitrário em todas as páginas públicas e privadas.",
        "// src/app/layout.tsx:261, 281\ngtag('config', '${gaId}', { ... });\n})(window,document,'script','dataLayer','${gtmId}');",
        "// Validar estritamente o formato alfanumérico antes da injeção no DOM:\nconst GA_REGEX = /^[A-Z0-9-]{4,20}$/i;\nconst safeGaId = GA_REGEX.test(gaId || '') ? gaId : null;\nconst safeGtmId = GA_REGEX.test(gtmId || '') ? gtmId : null;\n// Injetar script somente se safeGaId / safeGtmId forem válidos."
    ))

    story.append(PageBreak())
    # SEÇÃO 4: PLANO DE REMEDIAÇÃO PRIORIZADO
    story.append(Paragraph("4. Plano de Remediação Priorizado", style_h1))
    story.append(Paragraph(
        "A remediação está dividida em 3 fases cronológicas de acordo com a criticidade do risco e impacto:",
        style_body
    ))
    story.append(Spacer(1, 8))

    rem_headers = [
        Paragraph("<b>Fase / Prazo</b>", style_table_th),
        Paragraph("<b>ID</b>", style_table_th),
        Paragraph("<b>Ação Recomendada</b>", style_table_th),
        Paragraph("<b>Alvo / Arquivo</b>", style_table_th),
        Paragraph("<b>Esforço</b>", style_table_th),
    ]

    rem_rows = [
        rem_headers,
        [
            Paragraph("<b>P1 (Alta)<br/>Prazo: 24h</b>", style_table_td),
            Paragraph("<b>C1-01</b>", style_table_td),
            Paragraph("Expurgar <code>n8nWebhookUrl</code> do GET /api/site-config e bloquear leitura pública de <code>/config/*</code> no Firestore", style_table_td),
            Paragraph("<code>firestore.rules</code><br/><code>api/site-config</code>", style_table_td),
            Paragraph("1 hora", style_table_td)
        ],
        [
            Paragraph("<b>P1 (Alta)<br/>Prazo: 24h</b>", style_table_td),
            Paragraph("<b>C5-01</b>", style_table_td),
            Paragraph("Substituir sanitização regex por <code>isomorphic-dompurify</code> no blog", style_table_td),
            Paragraph("<code>src/lib/security.ts</code>", style_table_td),
            Paragraph("1 hora", style_table_td)
        ],
        [
            Paragraph("<b>P1 (Alta)<br/>Prazo: 24h</b>", style_table_td),
            Paragraph("<b>C5-02</b>", style_table_td),
            Paragraph("Adicionar regex alfanumérica em <code>gaId</code> e <code>gtmId</code> antes de interpolar em scripts inline", style_table_td),
            Paragraph("<code>src/app/layout.tsx</code>", style_table_td),
            Paragraph("30 min", style_table_td)
        ],
        [
            Paragraph("<b>P2 (Média)<br/>Sprint Atual</b>", style_table_td),
            Paragraph("<b>C2-01</b>", style_table_td),
            Paragraph("Emitir cookie HttpOnly <code>admin_session</code> no fluxo de fallback de login via Firebase Auth", style_table_td),
            Paragraph("<code>src/services/authService.ts</code>", style_table_td),
            Paragraph("2 horas", style_table_td)
        ],
        [
            Paragraph("<b>P2 (Média)<br/>Sprint Atual</b>", style_table_td),
            Paragraph("<b>C4-01</b>", style_table_td),
            Paragraph("Remover lista de e-mails administrativos do bundle client-side", style_table_td),
            Paragraph("<code>src/services/authService.ts</code>", style_table_td),
            Paragraph("1 hora", style_table_td)
        ],
        [
            Paragraph("<b>P2 (Média)<br/>Sprint Atual</b>", style_table_td),
            Paragraph("<b>C4-02</b>", style_table_td),
            Paragraph("Substituir comparação === por <code>timingSafeEqual</code> no endpoint de login", style_table_td),
            Paragraph("<code>api/admin/login/route.ts</code>", style_table_td),
            Paragraph("30 min", style_table_td)
        ],
        [
            Paragraph("<b>P3 (Baixa)<br/>Próxima Sprint</b>", style_table_td),
            Paragraph("<b>C2-02</b>", style_table_td),
            Paragraph("Adicionar guard de middleware para rotas <code>/api/admin/*</code> (Defesa em Profundidade)", style_table_td),
            Paragraph("<code>src/middleware.ts</code>", style_table_td),
            Paragraph("1 hora", style_table_td)
        ],
        [
            Paragraph("<b>P3 (Baixa)<br/>Próxima Sprint</b>", style_table_td),
            Paragraph("<b>C3-01</b>", style_table_td),
            Paragraph("Padronizar validação de formato de IDs dinâmicos em posts e cursos", style_table_td),
            Paragraph("<code>api/posts/[id]</code><br/><code>api/courses/[id]</code>", style_table_td),
            Paragraph("45 min", style_table_td)
        ],
        [
            Paragraph("<b>P3 (Baixa)<br/>Próxima Sprint</b>", style_table_td),
            Paragraph("<b>C4-03</b>", style_table_td),
            Paragraph("Garantir rotação de credenciais de produção e saneamento de histórico Git", style_table_td),
            Paragraph("Repositório Git", style_table_td),
            Paragraph("1 hora", style_table_td)
        ]
    ]

    rem_table = Table(rem_rows, colWidths=[80, 42, 195, 110, 60])
    rem_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), COLOR_DARK),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOX', (0,0), (-1,-1), 1, COLOR_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.5, COLOR_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 4.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4.5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('ROWBACKGROUNDS', (0,1), (-1,3), [colors.HexColor('#FEF2F2'), colors.HexColor('#FFF7ED')]),
        ('ROWBACKGROUNDS', (0,4), (-1,6), [COLOR_WHITE, COLOR_LIGHT]),
        ('ROWBACKGROUNDS', (0,7), (-1,-1), [COLOR_LIGHT, COLOR_WHITE]),
    ]))
    story.append(rem_table)

    story.append(PageBreak())
    # SEÇÃO 5: MODELOS DE GITHUB ISSUES
    story.append(Paragraph("5. Modelos de GitHub Issues Prontos para Abertura", style_h1))
    story.append(Paragraph(
        "Os modelos abaixo estão formatados para cópia direta no GitHub Issues com passos de reprodução e correção:",
        style_body
    ))
    story.append(Spacer(1, 8))

    issues = [
        ("ISSUE 1", "security: ocultar n8nWebhookUrl na API pública e restringir leitura no Firestore", "security, backend, high-priority",
         "### Descrição\nA URL privada do webhook n8n é exposta no endpoint público GET /api/site-config e pode ser lida por clientes não autenticados via Firestore SDK devido à regra aberta match /config/{configId} { allow read: if true; }.\n\n### Passos para Reproduzir\n1. Executar `curl -s https://www.easytraining.com.br/api/site-config`\n2. Observar o campo `n8nWebhookUrl` retornado no JSON público.\n\n### Correção Proposta\n1. Em `src/app/api/site-config/route.ts`, filtrar `n8nWebhookUrl` da resposta pública.\n2. Em `firestore.rules`, alterar a regra de `/config/{configId}` para `allow read, write: if false;`."),

        ("ISSUE 2", "security: substituir sanitizador HTML por DOMPurify para prevenir Stored XSS no Blog", "security, frontend, high-priority",
         "### Descrição\nA função `sanitizeHtmlContent` em `src/lib/security.ts` utiliza regex ingênua que pode ser contornada por tags maliciosas ou manipuladores sem espaçamento padrão (ex: `<svg/onload=alert(1)>`), sendo renderizada diretamente via `dangerouslySetInnerHTML`.\n\n### Passos para Reproduzir\n1. Criar um post via admin com payload de evento malicioso em tag não filtrada.\n2. Acessar a página pública do artigo `/blog/[slug]`.\n3. O script injetado é executado no contexto da página.\n\n### Correção Proposta\nInstalar `isomorphic-dompurify` e sanitizar o HTML com lista restrita de tags e atributos permitidos antes de renderizar."),

        ("ISSUE 3", "security: validar formato de IDs de GA4 e GTM no RootLayout", "security, frontend, high-priority",
         "### Descrição\nNo arquivo `src/app/layout.tsx`, `googleAnalyticsId` e `googleTagManagerId` são interpolados diretamente em scripts inline. Se um valor contendo aspas for gravado nas configurações, ele causará Stored XSS generalizado.\n\n### Passos para Reproduzir\n1. Atualizar siteConfig com `googleAnalyticsId: \"G-TEST'); alert(1); //\"`.\n2. Acessar qualquer página do site e verificar a quebra e execução indevida de JavaScript.\n\n### Correção Proposta\nValidar com `/^[A-Z0-9-]{4,20}$/i` antes de injetar os identificadores no template literal do script."),

        ("ISSUE 4", "security: sincronizar sessão server-side no fallback de login do Firebase Auth", "security, auth, medium-priority",
         "### Descrição\nQuando o login é realizado pelo fallback do Firebase Auth no cliente, apenas o `localStorage` é preenchido. O cookie HttpOnly `admin_session` não é gerado, resultando em interface administrativa aberta no navegador mas com todas as requisições de API bloqueadas com 401.\n\n### Passos para Reproduzir\n1. Efetuar login através do fallback Firebase Auth.\n2. O dashboard abre, mas ao tentar salvar qualquer post ou curso, a requisição é rejeitada pelo backend.\n\n### Correção Proposta\nFazer com que o fluxo envie o `idToken` do Firebase para o endpoint `/api/admin/login` e receba o cookie `admin_session` oficial."),

        ("ISSUE 5", "security: remover ALLOWED_ADMIN_EMAILS do bundle público do cliente", "security, hardening, medium-priority",
         "### Descrição\nO array `ALLOWED_ADMIN_EMAILS` está no arquivo `src/services/authService.ts`, que é incluído no bundle público gerado pelo Webpack/Turbopack, expondo a lista de e-mails de todos os administradores.\n\n### Passos para Reproduzir\n1. Inspecionar o código-fonte empacotado no navegador.\n2. Buscar por `@easytraining.com.br` e visualizar os e-mails administrativos.\n\n### Correção Proposta\nManter a lista de e-mails estritamente no backend (`src/lib/authServer.ts`)."),

        ("ISSUE 6", "security: utilizar timingSafeEqual na validação de senha mestra", "security, backend, medium-priority",
         "### Descrição\nA verificação de senha administrativa no endpoint `POST /api/admin/login` utiliza o operador `===`, suscetível a ataques de tempo (timing attacks) para adivinhação da senha caractere por caractere.\n\n### Passos para Reproduzir\nAnálise estática do arquivo `src/app/api/admin/login/route.ts` linha 37.\n\n### Correção Proposta\nUtilizar `crypto.timingSafeEqual` com buffers de comprimento padronizado."),

        ("ISSUE 7", "security: adicionar guard de autenticação para /api/admin/* no middleware", "security, architecture, low-priority",
         "### Descrição\nO middleware atual em `src/middleware.ts` isenta todas as rotas `/api`. Embora cada rota verifique individualmente o token, a inclusão de um guard centralizado adiciona a camada necessária de Defesa em Profundidade.\n\n### Correção Proposta\nAdicionar verificação de presença e formato do cookie `admin_session` para requisições em `/api/admin/*` diretamente no middleware.")
    ]

    def wrap_issue_markdown(text, width=90):
        out = []
        for line in text.splitlines():
            if len(line) > width and not line.startswith('---'):
                out.append(textwrap.fill(line, width=width, break_long_words=False))
            else:
                out.append(line)
        return '\n'.join(out)

    for iname, ititle, ilabels, ibody in issues:
        wrapped_body = wrap_issue_markdown(ibody, 90)
        md_text = f"--- {iname} ---\n**Título:** {ititle}\n**Labels:** `{ilabels}`\n\n{wrapped_body}\n--- FIM {iname} ---"
        issue_table = Table([[Preformatted(md_text, style_code)]], colWidths=[USABLE_WIDTH])
        issue_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), COLOR_CARD),
            ('BOX', (0,0), (-1,-1), 0.8, COLOR_BORDER),
            ('TOPPADDING', (0,0), (-1,-1), 5),
            ('BOTTOMPADDING', (0,0), (-1,-1), 5),
            ('LEFTPADDING', (0,0), (-1,-1), 7),
            ('RIGHTPADDING', (0,0), (-1,-1), 7),
        ]))
        story.append(issue_table)
        story.append(Spacer(1, 6))

    # Construção com NumberedCanvas
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[3/3] Relatório PDF gerado com sucesso em:\n      {PDF_PATH}")

if __name__ == '__main__':
    try:
        generate_charts()
        build_pdf()
        print("\nProcesso concluído com 100% de sucesso.")
    except Exception as e:
        print(f"\nERRO DURANTE A GERAÇÃO DO RELATÓRIO: {e}", file=sys.stderr)
        sys.exit(1)
