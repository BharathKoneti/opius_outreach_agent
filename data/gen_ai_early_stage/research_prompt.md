# Early-Stage Gen AI Startup Research Campaign
*Automated Web Research Using Playwright MCP*

## Project Organization

**Base Directory**: `data/gen_ai_early_stage/`

All research data, analysis, and automation scripts should be organized within this dedicated folder structure:

```
data/gen_ai_early_stage/
├── README.md                           # Project overview and documentation
├── research_prompt.md                  # This file - complete methodology
├── companies.json                      # Master JSON database
├── by_category/                        # Category-specific company analysis
├── analysis/                           # Market analysis and insights
└── logs/                               # Research progress and validation
```

**IMPORTANT**: All file paths, data storage, and automation outputs must be contained within the `data/gen_ai_early_stage/` directory to maintain project organization and avoid conflicts with other research projects.

## Campaign Overview
**Objective**: Build a comprehensive database of pre-seed generative AI startups (very early stage, $100K-$10M valuations) that have raised funding in recent years (2022-2025) to identify emerging trends, investors, and opportunities.

**Target Scope**: 
- **Valuation Range**: $100K - $10M (pre-seed, early seed rounds)
- **Funding Stages**: Pre-seed, early seed (typically $100K-$3M rounds)
- **Funding Timeline**: Raised funds between 2022-2025
- **Focus**: Generative AI, LLMs, AI agents, AI developer tools, AI applications
- **Geographic**: Global, with emphasis on US, Europe, and emerging markets

**Research Strategy**: Use Playwright MCP for automated web scraping and data collection from multiple sources including Crunchbase, PitchBook, TechCrunch, and startup databases.

## Browser Automation Workflow

### Phase 1: Data Source Identification and Setup
**Primary Research Sources:**
1. **AngelList/Wellfound** - Pre-seed startup profiles and early funding (PRIMARY)
2. **Y Combinator** - Batch companies and demo day presentations (PRIMARY)
3. **Product Hunt** - AI product launches and early traction (PRIMARY)
4. **Crunchbase** - Funding data, valuations, investor information
5. **TechCrunch** - Early funding announcements and startup news
6. **Founder social media** - Twitter/LinkedIn announcements of pre-seed rounds
7. **Accelerator programs** - Techstars, 500 Startups, other AI-focused accelerators
8. **University incubators** - Stanford StartX, MIT delta v, Berkeley SkyDeck
9. **AI-specific communities** - AI Twitter, Discord communities, Reddit r/MachineLearning

**Browser Automation Setup:**
- Agent will systematically navigate each source
- Take screenshots for data validation (save to `data/gen_ai_early_stage/logs/screenshots/`)
- Extract structured data using CSS selectors
- Handle pagination and infinite scroll
- Manage rate limiting and anti-bot measures
- Save progress checkpoints for resumability (save to `data/gen_ai_early_stage/logs/`)
- All automation outputs stored within project directory structure

### Phase 2: Search Strategy and Filtering

**Primary Search Terms:**
- "generative AI startup pre-seed 2024"
- "AI agent startup pre-seed funding"
- "LLM startup early seed round 2024"
- "AI developer tools pre-seed"
- "AI application startup angel funding"
- "machine learning startup pre-seed"
- "artificial intelligence pre-seed funding"
- "AI infrastructure startup angel round"
- "YC AI startup demo day"
- "AI startup accelerator batch"

**Advanced Filtering Criteria:**
```javascript
// Crunchbase/AngelList Advanced Search Parameters
{
  "funding_rounds": {
    "announced_on": "2022-01-01 to 2025-12-31",
    "money_raised": "100K to 10M USD",
    "investment_type": ["pre_seed", "seed", "angel", "convertible_note"]
  },
  "company_stage": ["early_stage", "startup"],
  "employee_count": "1-50",
  "categories": [
    "Artificial Intelligence",
    "Machine Learning", 
    "Natural Language Processing",
    "Computer Vision",
    "Developer Tools",
    "Enterprise Software",
    "SaaS",
    "Robotics",
    "Automation"
  ],
  "keywords": [
    "generative AI", "LLM", "GPT", "AI agent", 
    "AI assistant", "AI platform", "AI infrastructure",
    "AI developer tools", "AI automation", "pre-seed", "stealth"
  ]
}
```

### Phase 3: Data Collection Framework

**Company Profile Data Structure:**
```json
{
  "company_name": "string",
  "website": "url",
  "year_founded": "number",
  "pivot_year": "number (if applicable)",
  "headquarters": "city, country",
  "category": "Model|App|Infra|Robotics|DevTools|Enterprise",
  "subcategory": "specific focus area",
  "description": "one-line company description",
  "current_valuation_million": "number (0.1-10M range)",
  "total_funding_million": "number (0.1-10M range)",
  "last_funding_round": {
    "round_type": "pre_seed|seed|angel|convertible_note",
    "amount_million": "number (0.1-3M typical)",
    "date": "YYYY-MM-DD",
    "lead_investors": ["investor1", "investor2"],
    "participating_investors": ["investor3", "investor4"]
  },
  "all_funding_rounds": [
    {
      "round_type": "string",
      "amount_million": "number", 
      "date": "YYYY-MM-DD",
      "investors": ["list"]
    }
  ],
  "founder_profiles": [
    {
      "name": "string",
      "title": "string",
      "background": "previous company/role",
      "linkedin": "url"
    }
  ],
  "key_metrics": {
    "employees": "number",
    "customers": "number (if available)",
    "arr_million": "number (if available)",
    "growth_rate": "percentage (if available)"
  },
  "product_focus": "detailed product description",
  "competitive_positioning": "vs competitors",
  "ai_technology": "underlying AI tech stack",
  "target_market": "customer segment",
  "business_model": "B2B|B2C|B2B2C|Marketplace|SaaS",
  "revenue_model": "subscription|usage|transaction|license",
  "partnerships": ["strategic partners"],
  "recent_news": ["recent announcements"],
  "social_proof": {
    "twitter_followers": "number",
    "linkedin_followers": "number", 
    "github_stars": "number (if applicable)",
    "product_hunt_votes": "number (if applicable)"
  },
  "research_date": "YYYY-MM-DD",
  "data_sources": ["crunchbase", "techcrunch", "etc"]
}
```

### Phase 4: Automated Research Process

**Step 1: AngelList/Wellfound Primary Search**
```python
# Playwright automation workflow - AngelList Focus
1. Navigate to wellfound.com/discover
2. Apply advanced filters:
   - Stage: "Early Stage" (Pre-Seed, Seed)
   - Industries: "Artificial Intelligence", "Machine Learning"
   - Funding Range: "$100K - $10M"
   - Founded Date: "2020-2025"
   - Last Funding Date: "2022-2025"
   - Company Size: "1-50 employees"
3. Sort by "Most Recent Activity"
4. Extract company data from search results
5. Click through to individual company pages
6. Scrape detailed funding history, investor data, team info
7. Handle pagination and infinite scroll
8. Save progress after each page
```

**Step 1b: Y Combinator Batch Analysis**
```python
# YC Demo Day and Batch Research
1. Navigate to ycombinator.com/companies
2. Filter by batch years: W22, S22, W23, S23, W24, S24, W25
3. Search for AI-related companies using keywords
4. Extract company profiles, funding status, demo day info
5. Cross-reference with funding announcements
6. Identify pre-seed/seed stage companies
```

**Step 2: Social Media and Community Research**
```python
# Founder/Company Social Media Research
1. Search Twitter for "[company_name] pre-seed" or "[founder_name] raised"
2. Monitor AI Twitter accounts for funding announcements
3. Check LinkedIn for founder funding posts
4. Search Reddit r/MachineLearning for company mentions
5. Monitor Discord AI communities for early-stage discussions
6. Validate funding amounts and dates from social sources
```

**Step 3: Founder and Team Research**
```python
# LinkedIn founder profile research
1. Search LinkedIn for company founders
2. Extract founder backgrounds and previous companies
3. Identify serial entrepreneurs and notable exits
4. Map founder networks and connections
5. Assess team credibility and domain expertise
```

**Step 4: Product and Early Traction Research**
```python
# Product validation and early market traction
1. Visit company websites and product pages (often minimal/stealth)
2. Check Product Hunt for launch data and votes
3. Search GitHub for open source projects and activity
4. Analyze social media presence and engagement
5. Look for early customer testimonials, beta users
6. Check for accelerator program participation
7. Monitor for demo videos, MVP launches
8. Assess technical blog posts and thought leadership
```

### Phase 5: Data Validation and Enrichment

**Validation Checklist:**
- [ ] Funding amounts match across multiple sources
- [ ] Investor names are correctly attributed
- [ ] Company categories are accurately classified
- [ ] Founder information is current and complete
- [ ] Product descriptions are factual and current
- [ ] Valuation data is from credible sources

**Enrichment Sources:**
- **Pitchbook**: Private market valuations and investor details
- **CB Insights**: Market intelligence and competitive analysis
- **Wellfound**: Team size and hiring data
- **Glassdoor**: Company culture and employee reviews
- **G2/Capterra**: Product reviews and market positioning

### Phase 6: Categorization Framework

**Primary Categories:**
1. **Foundation Models** - Companies building LLMs, multimodal models
2. **AI Applications** - Vertical-specific AI solutions
3. **Developer Tools** - AI-powered development platforms
4. **AI Infrastructure** - Training, deployment, and scaling platforms
5. **AI Agents** - Autonomous AI systems and workflows
6. **Enterprise AI** - B2B AI platforms and solutions
7. **Consumer AI** - B2C AI applications and services
8. **AI Hardware** - Specialized AI chips and hardware
9. **AI Data** - Data platforms and AI training datasets
10. **AI Security** - AI safety, alignment, and security tools

**Subcategory Examples:**
- **Developer Tools**: Code generation, testing, debugging, documentation
- **Enterprise AI**: Sales automation, customer service, HR, finance
- **AI Agents**: Workflow automation, research assistants, personal AI
- **Consumer AI**: Content creation, education, entertainment, productivity

### Phase 7: Investor Analysis Framework

**Investor Tracking:**
```json
{
  "investor_name": "string",
  "investor_type": "VC|Angel|Corporate|Government",
  "portfolio_companies": ["company1", "company2"],
  "total_investments": "number",
  "average_check_size": "number",
  "investment_stages": ["seed", "series_a"],
  "ai_focus_areas": ["categories"],
  "geographic_focus": ["regions"],
  "notable_exits": ["successful exits"],
  "investment_thesis": "AI investment approach"
}
```

**Key Metrics to Track:**
- Most active AI investors by deal count
- Average check sizes by stage and category
- Geographic distribution of investments
- Sector specialization patterns
- Co-investment networks and syndication patterns

### Phase 8: Market Analysis and Insights

**Trend Analysis:**
1. **Funding Velocity**: Monthly/quarterly funding trends
2. **Valuation Multiples**: Revenue multiples by category
3. **Geographic Shifts**: Emerging AI hubs and markets
4. **Category Evolution**: New AI application areas
5. **Investor Behavior**: Changing investment patterns

**Competitive Intelligence:**
1. **Market Concentration**: Leaders vs. long tail
2. **Technology Convergence**: Overlapping capabilities
3. **Partnership Patterns**: Strategic alliances
4. **Talent Migration**: Founder and team movements
5. **Product Evolution**: Feature and capability trends

## Automation Implementation

### Browser Automation Scripts

**Crunchbase Scraper:**
```python
# Playwright script for Crunchbase data extraction
async def scrape_crunchbase_companies():
    browser = await playwright.chromium.launch()
    page = await browser.new_page()
    
    # Navigate to advanced search
    await page.goto("https://www.crunchbase.com/discover/organization.companies")
    
    # Apply filters
    await apply_ai_filters(page)
    
    # Extract company data
    companies = []
    page_num = 1
    
    while True:
        # Extract current page data
        company_data = await extract_company_list(page)
        companies.extend(company_data)
        
        # Check for next page
        if not await has_next_page(page):
            break
            
        await go_to_next_page(page)
        page_num += 1
        
        # Save progress checkpoint
        await save_checkpoint(companies, page_num, 'data/gen_ai_early_stage/logs/')
    
    await browser.close()
    return companies
```

**Data Enrichment Pipeline:**
```python
# Multi-source data enrichment
async def enrich_company_data(company):
    # TechCrunch validation
    tc_data = await scrape_techcrunch_funding(company.name)
    
    # LinkedIn founder research  
    founder_data = await research_founders(company.founders)
    
    # Product traction research
    traction_data = await analyze_product_traction(company.website)
    
    # Combine and validate data
    enriched_data = merge_data_sources(company, tc_data, founder_data, traction_data)
    
    return enriched_data
```

### Rate Limiting and Ethics

**Responsible Scraping:**
- Implement delays between requests (2-5 seconds)
- Respect robots.txt files
- Use rotating user agents and IP addresses
- Implement exponential backoff for rate limiting
- Cache results to minimize repeat requests
- Only collect publicly available information

**Data Privacy:**
- Focus on business information, not personal data
- Respect privacy settings and access controls
- Anonymize sensitive information where appropriate
- Comply with GDPR and data protection regulations

## Output Deliverables

### 1. Master Database
**File**: `data/gen_ai_early_stage/companies.json`
- Complete JSON database of all companies
- Standardized data structure for analysis
- Regular updates and version control

### 2. Category Analysis
**Files**: 
- `data/gen_ai_early_stage/by_category/foundation_models.md`
- `data/gen_ai_early_stage/by_category/ai_applications.md`
- `data/gen_ai_early_stage/by_category/developer_tools.md`
- `data/gen_ai_early_stage/by_category/ai_infrastructure.md`
- `data/gen_ai_early_stage/by_category/ai_agents.md`
- `data/gen_ai_early_stage/by_category/enterprise_ai.md`
- `data/gen_ai_early_stage/by_category/consumer_ai.md`
- `data/gen_ai_early_stage/by_category/ai_hardware.md`
- `data/gen_ai_early_stage/by_category/ai_data.md`
- `data/gen_ai_early_stage/by_category/ai_security.md`

### 3. Investor Analysis
**Files**:
- `data/gen_ai_early_stage/analysis/by_investor.md`
- `data/gen_ai_early_stage/analysis/funding_trends.md`
- `data/gen_ai_early_stage/analysis/valuation_analysis.md`
- `data/gen_ai_early_stage/analysis/investor_networks.md`
- `data/gen_ai_early_stage/analysis/geographic_distribution.md`

### 4. Market Intelligence
**Files**:
- `data/gen_ai_early_stage/analysis/market_overview.md`
- `data/gen_ai_early_stage/analysis/competitive_landscape.md`
- `data/gen_ai_early_stage/analysis/emerging_trends.md`
- `data/gen_ai_early_stage/analysis/technology_convergence.md`
- `data/gen_ai_early_stage/analysis/partnership_patterns.md`

### 5. Strategic Insights
**File**: `data/gen_ai_early_stage/analysis/strategic_insights.md`
- Fundraising patterns and strategies
- Investor targeting recommendations
- Market positioning opportunities
- Competitive intelligence for Opius AI

### 6. Research Logs and Progress
**Files**:
- `data/gen_ai_early_stage/logs/research_progress.md`
- `data/gen_ai_early_stage/logs/data_validation_log.md`
- `data/gen_ai_early_stage/logs/source_reliability.md`
- `data/gen_ai_early_stage/logs/automation_performance.md`

## Success Metrics

**Quantitative Goals:**
- **Target Companies**: 100-300 pre-seed AI companies
- **Data Completeness**: 80%+ complete profiles (pre-seed data often limited)
- **Source Validation**: 2+ sources per company (fewer public sources available)
- **Update Frequency**: Bi-weekly refresh cycles (faster-moving pre-seed stage)
- **Geographic Coverage**: 70% US, 20% Europe, 10% Other

**Qualitative Goals:**
- Identify emerging AI categories and trends
- Map investor networks and preferences
- Understand successful fundraising strategies
- Discover potential acquisition targets or partners
- Generate actionable insights for Opius AI strategy

## Research Timeline

**Week 1-2: Infrastructure Setup**
- Develop Playwright automation scripts
- Test data extraction pipelines
- Establish data validation processes
- Create database schemas and storage

**Week 3-4: Primary Data Collection**
- Systematic Crunchbase scraping
- TechCrunch funding announcement research
- Initial company profile compilation
- Investor mapping and analysis

**Week 5-6: Data Enrichment**
- Founder and team research
- Product traction analysis
- Competitive positioning research
- Social proof and metrics collection

**Week 7-8: Analysis and Insights**
- Category analysis and segmentation
- Investor behavior analysis
- Market trend identification
- Strategic insight generation

**Ongoing: Maintenance and Updates**
- Monthly database updates
- New funding round tracking
- Emerging company identification
- Trend analysis and reporting

## Integration with Opius AI Strategy

**Direct Applications:**
1. **Investor Targeting**: Identify VCs most active in AI developer tools
2. **Competitive Analysis**: Map direct and indirect competitors
3. **Partnership Opportunities**: Find complementary AI companies
4. **Talent Acquisition**: Identify companies with relevant expertise
5. **Market Positioning**: Understand category dynamics and positioning

**Strategic Value:**
- **Fundraising Strategy**: Learn from successful early-stage AI fundraising
- **Product Development**: Identify market gaps and opportunities
- **Business Development**: Find potential customers and partners
- **Competitive Intelligence**: Stay ahead of market developments
- **Investment Opportunities**: Identify potential acquisition targets

---

**Research Methodology**: Automated web research using Playwright MCP
**Data Quality**: Multi-source validation and verification
**Update Frequency**: Monthly with real-time funding alerts
**Compliance**: Ethical scraping practices and data privacy protection 