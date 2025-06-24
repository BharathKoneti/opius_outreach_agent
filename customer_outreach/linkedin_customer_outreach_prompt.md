# LinkedIn Customer Outreach Campaign Prompt Template

## Campaign Overview
**Objective**: Contact potential customers on LinkedIn to introduce Opius AI and generate leads for sales conversations.

**Target**: CTOs, VP Engineering, Startup Founders, Technical Co-founders, Product Managers, Digital Transformation Leaders
**Platform**: LinkedIn (using connection invitations with personalized notes)
**Strategy**: Focus on 2nd degree connections for better response rates, avoid InMail to save credits

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
# Today's LinkedIn Customer Outreach Session - [DATE]

## Session Goals
- Target: [X] new potential customers
- Focus: [specific criteria, e.g., CTOs at 50-200 person companies, AI/software focus]

## Contacts Made Today
1. **[Name]** - [Title] at [Company]
   - Company Size: [employees/revenue range]
   - Industry: [tech sector]
   - Connection Degree: [1st/2nd/3rd+]
   - AI/Software Development: [Rating/Notes]
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
- [Company size/industry priorities]
```

## Campaign Instructions

### Step 1: Search Strategy
Use LinkedIn search with these terms targeting decision makers:

**For CTOs/Engineering Leaders:**
- "CTO startup"
- "VP Engineering"
- "Head of Engineering"
- "Chief Technology Officer"

**For Founders:**
- "Founder CEO technology"
- "Technical co-founder"
- "CEO startup software"

**For Product Leaders:**
- "VP Product"
- "Head of Product"
- "Product Director"

**Company Size Filters:**
- 11-50 employees (startups needing cost-effective solutions)
- 51-200 employees (SMBs with scaling challenges)
- 201-500 employees (mid-market with development bottlenecks)

### Step 2: Target Selection Criteria
**Prioritize in this order:**
1. **2nd degree connections** (highest priority - better response rates)
2. **1st degree connections** (if available)
3. **3rd+ degree connections** (only if no better options)

**MANDATORY CUSTOMER FIT REQUIREMENTS:**
- **Decision-maker**: CTO, VP Engineering, or similar with authority over technology purchases
- **Company type**: Technology/SaaS/software/digital product company (not solo consultancy or large enterprise)
- **Team evidence**: Explicit or strong evidence of a sizable engineering/product team (multiple engineers, not just the founder)
- **Clear, public evidence of external funding**: Company must have verifiable evidence of VC/angel investment, accelerator/incubator participation, or a funding round (profile, company page, or news). If in stealth/early-stage, there must be a direct mention of investor backing or accelerator/incubator. If no such evidence, SKIP outreach.
- **Development Needs**: Evidence of active software development (engineering team, product releases)
- **Decision Making Role**: Title indicates they make or influence technology purchasing decisions
- **Company Growth Stage**: Series A to Series B, or established companies with scaling challenges
- **Funding/Revenue Evidence**: Clear signs of funding or revenue (avoid pre-revenue startups without funding)

**Look for:**
- "Connect" button (indicates ability to send invitation) - may be under "More" button
- Relevant titles: CTO, VP Engineering, Founder, CEO, Head of Product
- Active companies (check recent activity/posts about product development)
- **Technology Focus Indicators**: Posts about software development, engineering challenges, product launches

**IMMEDIATE DISQUALIFICATION CRITERIA:**
- **Unfunded Early Startups**: Pre-revenue companies without funding (can't afford $500-2000/month pricing)
- **Pre-Seed/Bootstrapped Only**: Companies that appear to have no external funding or revenue
- **Non-Tech Companies**: Traditional retail, restaurants, consulting, finance (unless fintech)
- **No Development Team**: Individual consultants, freelancers without teams
- **Enterprise Only**: Large corporations (1000+ employees) likely to have complex procurement
- **Wrong Decision Level**: Junior developers, interns, non-decision makers
- **Non-Software Focus**: Hardware only, manufacturing, traditional services
- **Geographic Constraints**: Companies outside target market regions

### Step 2.5: Check Tracking Files (MANDATORY)
**BEFORE ANALYZING ANY CUSTOMER CANDIDATE**: Check these files to avoid duplicate work:

1. **Check Disqualified Customers**: Open `customer_outreach/linkedin_disqualified_customers.md`
   - Search for the candidate's name
   - If found: Skip this candidate and move to next
   - If not found: Proceed to profile vetting

2. **Check Sent Requests**: Open `customer_outreach/linkedin_sent_customer_requests.md`
   - Search for the candidate's name in the quick reference list
   - If found: Skip this candidate (already contacted)
   - If not found: Proceed to profile vetting

### Step 2.6: Profile Vetting Process
**MANDATORY**: Click on each potential target's profile to thoroughly vet them before sending connection requests.

**Profile Vetting Checklist:**
1. **Click on the prospect's name/profile** to open their full LinkedIn profile
2. **Verify Current Role**: 
   - Is their title accurate and current?
   - Do they have decision-making authority for technology purchases?
   - Check "Experience" section for role duration
3. **COMPANY VALIDATION** (CRITICAL):
   - **Active Development**: Evidence of software development team or product development
   - **Company Size**: 10-500 employees (sweet spot for our solution)
   - **Technology Focus**: SaaS, software, mobile apps, web platforms, AI/ML companies
   - **Growth Stage**: Series A to Series B, or established companies with scaling needs
   - **Funding/Revenue Validation**: Evidence of funding rounds, revenue, or paying customers (avoid unfunded startups)
   - **Recent Activity**: Company posts about product updates, engineering hiring, tech challenges
4. **DECISION MAKER VALIDATION**:
   - **Authority Level**: CTO, VP Engineering, Founder, CEO, Head of Product
   - **Technology Role**: Directly involved in development decisions and budget
   - **Team Size**: Manages or influences engineering team decisions
   - **Recent Posts**: Posts about engineering challenges, hiring developers, tech stack decisions
5. **PAIN POINT INDICATORS** (IDEAL):
   - Posts about hiring challenges, development bottlenecks, or scaling issues
   - Company job postings for multiple developers
   - Mentions of development costs, time-to-market challenges
   - Technical debt or legacy system modernization needs
6. **Activity Level**:
   - Check recent posts (last 3 months)
   - Look for technology-related content, product updates, team growth
   - Verify they're actively posting about company/industry topics
7. **Geographic Relevance**:
   - Check their location (US/Canada for initial focus)
   - Ensure company operates in markets we can serve
8. **Connection Quality**:
   - Review mutual connections (if 2nd degree)
   - Check if mutual connections are relevant to our industry

**Disqualification Criteria:**
- **PRIMARY**: No evidence of funding or revenue (unfunded early startups can't afford $500-2000/month)
- **SECONDARY**: No evidence of active software development or tech team
- **TERTIARY**: Company too large (1000+ employees) or too small (<5 employees)  
- Not currently in decision-making role for technology
- Focus on non-software industries (traditional retail, manufacturing, etc.)
- Individual consultants or freelancers without teams
- Geographic mismatch with our target markets
- Inactive LinkedIn profile (no posts in 6+ months)
- Suspicious or incomplete profile information

**Documentation During Vetting**:
- Note their company's development challenges for message personalization
- Flag any relevant technologies they use
- Note mutual connections for potential warm introductions

**Update Tracking Files After Vetting**:
- **If DISQUALIFIED**: Add entry to `linkedin_disqualified_customers.md` immediately
- **If QUALIFIED**: Proceed to connection process, then update `linkedin_sent_customer_requests.md`

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
7. **IMMEDIATELY UPDATE**: Add entry to `linkedin_sent_customer_requests.md` with all details
8. **UPDATE TODAY'S LOG**: Add entry to daily session tracking

### Step 4: Message Templates
**Character limit**: 300 characters (aim for 263-280 characters)

**Template A - General Tech Leaders:**
```
Hi [NAME], Opius AI gets 80% of development done with 20% of the team using autonomous AI agents. We cut development costs 40-60% and deliver 2-3x faster. Check our demo: https://opiusai.com/sandbox-demo/. Would love to connect!
```

**Template B - CTOs/Engineering Leaders:**
```
Hi [NAME], struggling with dev team scaling? Opius AI gets 80% of development done with 20% of the team using AI agents - 40-60% cost reduction, 2-3x faster delivery. See demo: https://opiusai.com/sandbox-demo/. Would love to discuss!
```

**Template C - Founders:**
```
Hi [NAME], Opius AI gets 80% of development done with 20% of the team. Our AI agents build complete applications - MVP to production. Days instead of weeks. Demo: https://opiusai.com/sandbox-demo/. Let's connect!
```

**Template Variables:**
- `[NAME]`: Replace with the prospect's first name
- Choose template based on their role/title
- Keep URLs exactly as shown
- Messages focus on core value propositions that resonate with decision makers

### Step 5: Tracking & Documentation
**MANDATORY**: Update tracking files throughout the campaign session.

**Primary Tracking Files**:
1. `customer_outreach/linkedin_disqualified_customers.md` - Add disqualified prospects immediately
2. `customer_outreach/linkedin_sent_customer_requests.md` - Add sent requests immediately
3. **Daily session log** - Maintain today's progress tracking
4. `customer_contacts_log.md` - Main campaign tracking (optional)

**Session Workflow**:
1. **Start Session**: Create today's log entry with goals
2. **During Session**: Update tracking files after each action
3. **After Each Contact**: Add entry to today's log
4. **End Session**: Complete today's log with statistics and observations

**Required tracking fields:**
- Prospect Name (First Last)
- Title
- Company
- Company Size
- Industry
- LinkedIn Profile URL
- Connection Degree (1st, 2nd, 3rd+)
- Date Contacted (YYYY-MM-DD)
- Time Contacted (HH:MM)
- Template Used (A/B/C)
- Status (Sent/Pending/Accepted/Declined/No Response)
- Response Notes
- Follow-up Required (Yes/No)
- Next Action

## Tracking System Workflow

### File Structure
```
customer_outreach/
├── linkedin_disqualified_customers.md     # All disqualified customer profiles
├── linkedin_sent_customer_requests.md     # All sent connection requests  
├── customer_contacts_log.md               # Main campaign tracking
├── linkedin_customer_outreach_prompt.md   # This prompt file
├── today_session_log.md                   # Today's session tracking
└── logs/                                  # Detailed session logs
```

### Workflow Steps
1. **Start Session**: Open both tracking files in separate tabs
2. **Create Today's Log**: Initialize daily session tracking
3. **For Each Customer Candidate**:
   - Check `linkedin_disqualified_customers.md` for their name
   - Check `linkedin_sent_customer_requests.md` quick reference list
   - If found in either: Skip candidate
   - If not found: Proceed with analysis
4. **After Analysis**:
   - If disqualified: Add to `linkedin_disqualified_customers.md`
   - If qualified and sent: Add to `linkedin_sent_customer_requests.md`
   - Update today's session log
5. **End Session**: Complete today's log with final statistics

## Campaign Execution Tips

### Best Practices
- **Check tracking files first**: Always check disqualified and sent request files before analyzing
- **Personalize when possible**: Reference their company's recent developments if visible
- **Quality over quantity**: Focus on decision makers with clear authority
- **Systematic approach**: Work through search results methodically
- **Track everything**: Update tracking files immediately during the process
- **Follow up promptly**: Respond to acceptances within 24 hours

### What to Avoid
- Don't use InMail (saves credits)
- Don't target individual contributors without decision authority
- Don't send generic connection requests without notes
- Don't target companies outside our ideal customer profile
- Don't modify proven templates significantly without testing

### Success Metrics
- **Response rate**: Track acceptance vs. total invitations
- **Engagement**: Monitor who views company page after connecting
- **Demo requests**: Track prospects who request product demonstrations
- **Sales qualified leads**: Ultimate goal is securing sales calls

## Value Propositions by Role

### For CTOs/VP Engineering
- 40-60% reduction in development costs
- 2-3x faster feature delivery
- No hiring bottlenecks or talent shortage issues
- Consistent code quality across all projects

### For Founders/CEOs
- Get to market without hiring full dev teams
- Scale development capacity instantly
- Predictable development costs and timelines
- Focus on business while AI handles development

### For Product Managers
- Days instead of weeks from idea to live feature
- No dependency on engineering availability
- Rapid prototyping and iteration
- Direct control over feature development

## Follow-up Strategy
After connections are accepted:
1. Thank them for connecting within 24 hours
2. Offer to schedule a brief product demonstration
3. Share relevant case studies or success stories
4. Provide access to live demo environment
5. Schedule discovery calls for qualified prospects

## Campaign Goals
- **Primary**: Generate qualified sales leads for Opius AI
- **Secondary**: Build awareness among target customer segments
- **Tertiary**: Gather market feedback and identify common pain points

---

**Last Updated**: January 2025
**Recommended Frequency**: Weekly campaigns with different search terms and segments
**Target Response Rate**: 15-25% connection acceptance rate