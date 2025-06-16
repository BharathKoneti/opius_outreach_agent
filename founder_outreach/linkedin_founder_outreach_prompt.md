# LinkedIn Founder Outreach Campaign Prompt Template

## Campaign Overview
**Objective**: Contact startup founders and tech company leaders on LinkedIn to introduce Opius AI and build connections for potential partnerships, early adoption, and strategic relationships.

**Target**: Founders, Co-Founders, CEOs, and CTOs at tech startups and software companies
**Platform**: LinkedIn (using connection invitations with personalized notes)
**Strategy**: Avoid InMail to save credits, focus on 2nd degree connections for better response rates

## Browser Automation Setup
**IMPORTANT**: This campaign uses Playwright MCP for browser automation. The AI agent will:

1. **Navigate LinkedIn automatically** using browser automation tools
2. **Take screenshots** to analyze search results and profiles
3. **Click elements** to open profiles and send connection requests
4. **Type messages** automatically using the provided templates
5. **Track progress** through multiple pages of search results

**Browser Automation Workflow**:
- Agent will open LinkedIn and navigate to search
- Systematically analyze each candidate profile
- Check tracking files before each analysis
- Send connection requests with personalized notes
- Update tracking files immediately after each action

## Daily Session Tracking
**MANDATORY**: Maintain a daily log for each session to track progress and ensure accountability.

### Today's Session Log Format
Create and maintain a daily session summary:

```markdown
# Today's LinkedIn Founder Outreach Session - [DATE]

## Session Goals
- Target: [X] new founder contacts
- Focus: [specific criteria, e.g., funded AI startups, developer tools founders]

## Contacts Made Today
1. **[Founder Name]** - [Title] at [Company]
   - Connection Degree: [1st/2nd/3rd+]
   - Funding Status: [Seed/Series A/Verified/Unverified]
   - Company Stage: [Early/Growth/Notes]
   - Message Sent: [Character count]
   - Status: [Sent/Pending]
   - Time: [HH:MM]

## Session Statistics
- **New Contacts Today**: [X]
- **Total Campaign Contacts**: [X]
- **Today's Success Rate**: [X]% (connections sent vs. profiles analyzed)
- **Disqualified Today**: [X]
- **Session Duration**: [X] minutes

## Key Observations
- [Notable findings about target quality, response patterns, etc.]

## Next Session Planning
- [Areas to focus on next time]
- [Search terms to try]
- [Connection degree priorities]
```

## Campaign Instructions

### Step 1: Search Strategy
Use LinkedIn search with these terms:
- "founder startup"
- "co-founder tech"
- "CEO startup"
- "CTO software"
- "founder AI"
- "founder developer tools"
- "startup founder software"

### Step 2: Target Selection Criteria
**Prioritize in this order:**
1. **2nd degree connections** (highest priority - better response rates)
2. **1st degree connections** (if available)
3. **3rd+ degree connections** (only if no better options)

**Look for:**
- "Connect" button (indicates ability to send invitation) - may be under "More" button
- Relevant titles: Founder, Co-Founder, CEO, CTO, Chief Technology Officer
- Active tech companies (check recent activity/posts)
- Software/AI/developer tools focus

### Step 2.5: Check Tracking Files (MANDATORY)
**BEFORE ANALYZING ANY CANDIDATE**: Check these files to avoid duplicate work:

1. **Check Disqualified Candidates**: Open `founder_outreach/linkedin_disqualified_candidates.md`
   - Search for the candidate's name
   - If found: Skip this candidate and move to next
   - If not found: Proceed to profile vetting

2. **Check Sent Requests**: Open `founder_outreach/linkedin_sent_requests.md`
   - Search for the candidate's name in the quick reference list
   - If found: Skip this candidate (already contacted)
   - If not found: Proceed to profile vetting

### Step 2.6: Profile Vetting Process
**MANDATORY**: Click on each potential target's profile to thoroughly vet them before sending connection requests.

**Profile Vetting Checklist:**
1. **Click on the founder's name/profile** to open their full LinkedIn profile
2. **Verify Current Role**: 
   - Is their title accurate and current?
   - Are they actually founding/leading a tech company?
   - Check "Experience" section for company details and role duration
3. **Company Assessment**:
   - Read their "About" section for company description
   - Check if they're building software/tech products
   - Look for AI, developer tools, or relevant tech focus
   - Verify company stage (early startup, growth stage, etc.)
4. **Company Validation**:
   - Click on their company name to verify it's a real tech company
   - Check company size and funding stage
   - Look for product descriptions or customer testimonials
5. **FUNDING VERIFICATION (MANDATORY)**:
   - **Target Only**: Companies with verified external funding (Seed, Series A, or later)
   - **Funding Verification Requirements**: Must have verifiable external funding from recognized sources:
     - Check for investor names in LinkedIn posts/about section
     - Look for funding announcements in their activity feed
     - Search for company name + "funding" or "seed round" in recent posts
     - Verify investor names are real VCs/angels with established portfolios
     - Look for third-party validation (TechCrunch, Crunchbase, press releases, etc.)
     - Cross-reference with external funding databases (Crunchbase, PitchBook, etc.)
   - **DISQUALIFY**: Bootstrapped companies, companies claiming funding without verification, or pre-revenue/pre-product startups
6. **Activity Level**:
   - Check recent posts (last 3 months)
   - Look for product updates, hiring posts, or industry commentary
   - Verify they're actively posting about startup/tech topics
7. **Geographic Relevance**:
   - Check their location (SF Bay Area, NYC, Austin, etc.)
   - Ensure they're building products for global/US markets
8. **Connection Quality**:
   - Review mutual connections (if 2nd degree)
   - Check if mutual connections are relevant to our industry
9. **Potential Fit Assessment**:
   - Do they build software products that could benefit from AI agents?
   - Are they in a stage where they might need development acceleration?
   - Do they have engineering teams that could use our tools?

**Disqualification Criteria:**
- Not currently active in founding/leadership role
- Focus on non-tech sectors (retail, hospitality, etc.)
- **Bootstrapped companies** (no external funding validation)
- **Unverified funding claims** (no external validation of investors/funding)
- **Pre-revenue/pre-product startups** (too early stage)
- **Series B+ companies** (likely have established processes, harder to sell to)
- **"Stealth mode" without funding verification** (could be just ideas)
- Hardware-only companies with no software component
- Inactive LinkedIn profile (no posts in 6+ months)
- Suspicious or incomplete profile information
- Companies that are clearly not a fit for developer tools

**Funding Verification Methods:**
1. **LinkedIn Activity**: Recent posts about funding rounds, investor meetings, or funding milestones
2. **About Section**: Mentions of specific investors, funding amounts, or funding rounds
3. **Company Page**: Check company LinkedIn page for funding announcements
4. **Investor Validation**: If investors mentioned, verify they're real VCs/angels with established portfolios
5. **Third-Party Sources**: Cross-reference with Crunchbase, PitchBook, TechCrunch, or other funding databases
6. **External Validation**: Look for press releases, news articles, or official funding announcements
7. **Investor Portfolio Check**: Verify mentioned investors have the company listed in their portfolio

**Documentation During Vetting**:
- Take note of their company's tech stack for potential customization
- Note any relevant product features or challenges mentioned
- Flag any mutual connections for potential warm introductions
- Identify specific pain points they might have mentioned

**Update Tracking Files After Vetting**:
- **If DISQUALIFIED**: Add entry to `linkedin_disqualified_candidates.md` immediately
- **If QUALIFIED**: Proceed to connection process, then update `linkedin_sent_requests.md`

### Step 3: Connection Process
**IMPORTANT**: Only proceed after completing Step 2.6 Profile Vetting and confirming candidate is not in tracking files

1. Navigate back to search results after profile review
2. Look for "Connect" button for qualified targets:
   - **Direct Connect**: Click "Connect" button if visible
   - **Hidden Connect**: If only "Message" and "More" buttons are visible, click "More" → then "Connect"
   - **Follow Only**: If only "Follow" button is available, skip this target (cannot send connection request)
3. Select "Add a note" 
4. Use the personalized message template below
5. Send invitation
6. Confirm "Pending" status appears
7. **IMMEDIATELY UPDATE**: Add entry to `linkedin_sent_requests.md` with all details
8. **UPDATE TODAY'S LOG**: Add entry to daily session tracking

### Step 4: Message Template
**Character limit**: 300 characters (aim for 260-270 characters)

```
Hi [NAME], at Opius AI we're building autonomous AI agents for software development without PMs/engineers. Planning Agent in early access, launching soon.  https://open-vsx.org/extension/opius-ai/opius-planner-cursor Would love to stay connected!
```

**Alternative Template for Developer Tool Founders:**
```
Hi [NAME], love what you're building at [COMPANY]! At Opius AI we're creating AI agents for software development without PMs/engineers. Planning Agent: https://open-vsx.org/extension/opius-ai/opius-planner-cursor Let's connect!
```

**Template Variables:**
- `[NAME]`: Replace with the founder's first name
- `[COMPANY]`: Replace with their company name (for alternative template)
- Keep URLs exactly as shown
- Choose template based on their company focus

### Step 5: Tracking & Documentation
**MANDATORY**: Update tracking files throughout the campaign session.

**Primary Tracking Files**:
1. `linkedin_disqualified_candidates.md` - Add disqualified candidates immediately
2. `linkedin_sent_requests.md` - Add sent requests immediately
3. **Daily session log** - Maintain today's progress tracking
4. `linkedin_outreach_tracking.md` - Detailed campaign tracking (optional)

**Session Workflow**:
1. **Start Session**: Create today's log entry with goals
2. **During Session**: Update tracking files after each action
3. **After Each Contact**: Add entry to today's log
4. **End Session**: Complete today's log with statistics and observations

**File Format**: Create a markdown table file named `linkedin_founder_outreach_log_[DATE].md` (if additional detailed tracking needed)

**Required tracking fields:**
- Founder Name (First Last)
- Title
- Company
- Funding Status (Seed/Series A/Series B/Unverified)
- Funding Details (Investor names, funding amount, verification source)
- LinkedIn Profile URL
- Connection Degree (1st, 2nd, 3rd+)
- Date Contacted (YYYY-MM-DD)
- Time Contacted (HH:MM)
- Status (Sent/Pending/Accepted/Declined/No Response)
- Message Template Used (Standard/Alternative)
- Response Received (Yes/No)
- Response Notes
- Potential Fit (High/Medium/Low)
- Follow-up Required (Yes/No)
- Next Action

**Sample Log Entry:**
```markdown
| Founder Name | Title | Company | Funding Status | Funding Details | LinkedIn URL | Connection Degree | Date | Time | Status | Template | Response | Response Notes | Fit | Follow-up | Next Action |
|--------------|-------|---------|----------------|-----------------|--------------|-------------------|------|------|--------|----------|----------|----------------|-----|-----------|-------------|
| Sarah Chen | Co-Founder & CTO | DevTools Inc | Seed | Andreessen Horowitz, $2M seed, Crunchbase verified | linkedin.com/in/sarahchen | 2nd | 2025-01-27 | 14:30 | Pending | Standard | No | - | High | Yes | Wait 1 week |
| Mike Johnson | Founder & CEO | CodeTools | Series A | Sequoia Capital, $8M Series A, TechCrunch article | linkedin.com/in/mikej | 2nd | 2025-01-27 | 15:15 | Pending | Standard | No | - | High | Yes | Wait 1 week |
```

**Documentation Process:**
1. **Before starting**: Check existing tracking files for duplicates
2. **During analysis**: Add disqualified candidates to `linkedin_disqualified_candidates.md`
3. **After sending**: Add sent requests to `linkedin_sent_requests.md` immediately
4. **End of session**: Update `linkedin_outreach_tracking.md` with session summary
5. **Weekly review**: Check for responses and update all tracking files

**File Location**: Save in `/founder_outreach/logs/` directory

## Tracking System Workflow

### File Structure
```
founder_outreach/
├── linkedin_disqualified_candidates.md    # All disqualified profiles
├── linkedin_sent_requests.md              # All sent connection requests  
├── linkedin_outreach_tracking.md          # Detailed campaign tracking
├── linkedin_founder_outreach_prompt.md    # This prompt file
├── today_session_log.md                   # Today's session tracking
└── logs/                                  # Detailed session logs
```

### Workflow Steps
1. **Start Session**: Open both tracking files in separate tabs
2. **Create Today's Log**: Initialize daily session tracking
3. **For Each Candidate**:
   - Check `linkedin_disqualified_candidates.md` for their name
   - Check `linkedin_sent_requests.md` quick reference list
   - If found in either: Skip candidate
   - If not found: Proceed with analysis
4. **After Analysis**:
   - If disqualified: Add to `linkedin_disqualified_candidates.md`
   - If qualified and sent: Add to `linkedin_sent_requests.md`
   - Update today's session log
5. **End Session**: Complete today's log with final statistics

### Quick Reference Format
- **Disqualified**: Name, Company, Reason, Date
- **Sent Requests**: Name, Company, Status, Funding Details

## Campaign Execution Tips

### Best Practices
- **Check tracking files first**: Always check disqualified and sent request files before analyzing
- **Maintain daily log**: Update today's session log after each contact
- **Quality over quantity**: Focus on relevant, high-potential targets
- **Funding verification first**: Always verify external funding status before sending connection requests
- **Systematic approach**: Work through search results methodically
- **Personalized messaging**: Use company name when possible
- **Track everything**: Update tracking files immediately during the process
- **Focus on fit**: Prioritize founders who could actually use our product
- **Funded company priority**: Funded founders have proven traction and investor validation
- **Avoid duplicates**: Never analyze or contact the same person twice

### What to Avoid
- Don't use InMail (saves credits)
- Don't send generic connection requests without notes
- Don't target 3rd+ connections if 2nd degree options available
- Don't contact founders of companies that clearly won't benefit from AI agents
- Don't modify the proven message templates significantly

### Success Metrics
- **Response rate**: Track acceptance vs. total invitations
- **Engagement**: Monitor who views your profile after connecting
- **Product interest**: Note founders who ask about the product
- **Demo requests**: Ultimate goal is securing product demos

## Target Company Types (High Priority)

### Ideal Targets (Verified Funded Companies Only):
- **Funded Developer Tools Companies**: Seed/Series A companies building tools for other developers
- **Funded SaaS Startups**: Software products with verified external funding and development teams
- **Funded AI/ML Companies**: Seed/Series A AI products with proven investor backing
- **Verified Seed-Stage Startups**: External funding confirmed, need to move fast with limited resources
- **Funded B2B Software**: Series A companies with complex products that could benefit from AI agents

### Good Targets:
- **E-commerce Platforms**: Custom software development needs
- **Fintech Startups**: Heavy software development requirements
- **Productivity Tools**: Understanding of automation benefits
- **Enterprise Software**: Large development teams

### Lower Priority:
- **Consumer Apps**: May not have complex development needs
- **Hardware Companies**: Limited software development
- **Service Businesses**: May not build software products

## Sample Successful Target Profiles
Based on ideal customer profile:
- **DevTools Startup Founder** - Building IDE extensions, needs faster development
- **SaaS CTO** - Managing 10+ engineer team, looking for productivity gains
- **AI Startup CEO** - Understands AI benefits, early adopter mindset
- **B2B Software Founder** - Complex product, needs development acceleration

## Campaign Goals
- **Primary**: Build network of founder connections for product adoption
- **Secondary**: Generate awareness for Opius AI among tech leaders
- **Tertiary**: Identify potential early adopters, beta users, and advisors
- **Quaternary**: Discover partnership opportunities

## Follow-up Strategy
After connections are accepted:
1. Thank them for connecting
2. Share relevant product updates or case studies
3. Offer product demos when appropriate
4. Request feedback calls for qualified prospects
5. Explore partnership opportunities for strategic fits

## Conversion Funnel
1. **Connection Request** → **Accepted**
2. **Follow-up Message** → **Response**
3. **Product Demo** → **Trial User**
4. **Trial** → **Paying Customer**
5. **Customer** → **Case Study/Reference**

---

**Last Updated**: January 2025
**Target Response Rate**: 15-25% (typically higher than VC outreach)
**Recommended Frequency**: Bi-weekly campaigns with different search terms
**Best Days**: Tuesday-Thursday for higher response rates 