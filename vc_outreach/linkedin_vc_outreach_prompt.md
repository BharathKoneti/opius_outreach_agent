# LinkedIn VC Outreach Campaign Prompt Template

## Campaign Overview
**Objective**: Contact venture capital professionals (VCs) on LinkedIn to introduce Opius AI and build connections for potential investment opportunities.

**Target**: General Partners, Managing Partners, and Founders at VC firms
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
# Today's LinkedIn VC Outreach Session - [DATE]

## Session Goals
- Target: [X] new VC contacts
- Focus: [specific criteria, e.g., AI-focused VCs, 2nd degree connections]

## Contacts Made Today
1. **[VC Name]** - [Title] at [Company]
   - Connection Degree: [1st/2nd/3rd+]
   - AI Investment Focus: [Rating/Notes]
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
- "venture capital general partner"
- "managing partner venture capital"
- "VC general partner"
- "venture capital founder"

### Step 2: Target Selection Criteria
**Prioritize in this order:**
1. **2nd degree connections** (highest priority - better response rates)
2. **1st degree connections** (if available)
3. **3rd+ degree connections** (only if no better options)

**Look for:**
- "Connect" button (indicates ability to send invitation) - may be under "More" button
- Relevant titles: General Partner, Managing Partner, Founder, Principal
- Active VC firms (check recent activity/posts)

### Step 2.5: Check Tracking Files (MANDATORY)
**BEFORE ANALYZING ANY VC CANDIDATE**: Check these files to avoid duplicate work:

1. **Check Disqualified VCs**: Open `vc_outreach/linkedin_disqualified_vcs.md`
   - Search for the candidate's name
   - If found: Skip this candidate and move to next
   - If not found: Proceed to profile vetting

2. **Check Sent Requests**: Open `vc_outreach/linkedin_sent_vc_requests.md`
   - Search for the candidate's name in the quick reference list
   - If found: Skip this candidate (already contacted)
   - If not found: Proceed to profile vetting

### Step 2.6: Profile Vetting Process
**MANDATORY**: Click on each potential target's profile to thoroughly vet them before sending connection requests.

**Profile Vetting Checklist:**
1. **Click on the VC's name/profile** to open their full LinkedIn profile
2. **Verify Current Role**: 
   - Is their title accurate and current?
   - Are they actually at a VC firm (not just claiming to be)?
   - Check "Experience" section for role duration
3. **Investment Focus Assessment**:
   - Read their "About" section for investment thesis
   - Check if they invest in tech/software companies
   - Look for AI, developer tools, or relevant sector experience
4. **Firm Validation**:
   - Click on their company name to verify it's a real VC firm
   - Check firm size and investment stage (seed, series A, etc.)
   - Look for portfolio companies in their posts/activity
5. **Activity Level**:
   - Check recent posts (last 3 months)
   - Look for investment announcements or industry commentary
   - Verify they're actively posting about VC/startup topics
6. **Geographic Relevance**:
   - Check their location (SF Bay Area, NYC, etc.)
   - Ensure they invest in US companies if we're US-based
7. **Connection Quality**:
   - Review mutual connections (if 2nd degree)
   - Check if mutual connections are relevant to our industry

**Disqualification Criteria:**
- Not currently active in VC role
- Focus on non-tech sectors (healthcare, energy, etc.)
- Only invests in very early pre-seed or very late stage
- Located in regions where they don't invest in US companies
- Inactive LinkedIn profile (no posts in 6+ months)
- Suspicious or incomplete profile information

**Documentation During Vetting**:
- Take note of their investment focus for potential customization
- Note any relevant portfolio companies
- Flag any mutual connections for potential warm introductions

**Update Tracking Files After Vetting**:
- **If DISQUALIFIED**: Add entry to `linkedin_disqualified_vcs.md` immediately
- **If QUALIFIED**: Proceed to connection process, then update `linkedin_sent_vc_requests.md`

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
7. **IMMEDIATELY UPDATE**: Add entry to `linkedin_sent_vc_requests.md` with all details
8. **UPDATE TODAY'S LOG**: Add entry to daily session tracking

### Step 4: Message Template
**Character limit**: 300 characters (aim for 263-268 characters)

```
Hi [NAME], at Opius AI we're building autonomous AI agents for software development without PMs/engineers. Planning Agent in early access, launching soon. https://opiusai.com/ https://open-vsx.org/extension/opius-ai/opius-planner-cursor Would love to stay connected!
```

**Template Variables:**
- `[NAME]`: Replace with the VC's first name
- Keep URLs exactly as shown (they're proven to work)
- Message has generated positive responses in previous campaigns

### Step 5: Tracking & Documentation
**MANDATORY**: Update tracking files throughout the campaign session.

**Primary Tracking Files**:
1. `linkedin_disqualified_vcs.md` - Add disqualified VCs immediately
2. `linkedin_sent_vc_requests.md` - Add sent requests immediately
3. **Daily session log** - Maintain today's progress tracking
4. `vc_contacts_log.md` - Main campaign tracking (optional)

**Session Workflow**:
1. **Start Session**: Create today's log entry with goals
2. **During Session**: Update tracking files after each action
3. **After Each Contact**: Add entry to today's log
4. **End Session**: Complete today's log with statistics and observations

**File Format**: Create a markdown table file named `linkedin_vc_outreach_log_[DATE].md` (if additional detailed tracking needed)

**Required tracking fields:**
- VC Name (First Last)
- Title
- Company
- LinkedIn Profile URL
- Connection Degree (1st, 2nd, 3rd+)
- Date Contacted (YYYY-MM-DD)
- Time Contacted (HH:MM)
- Status (Sent/Pending/Accepted/Declined/No Response)
- Message Sent (Yes/No - confirm template was used)
- Response Received (Yes/No)
- Response Notes
- Follow-up Required (Yes/No)
- Next Action

**Sample Log Entry:**
```markdown
| VC Name | Title | Company | LinkedIn URL | Connection Degree | Date | Time | Status | Message Sent | Response | Response Notes | Follow-up | Next Action |
|---------|-------|---------|--------------|-------------------|------|------|--------|--------------|----------|----------------|-----------|-------------|
| Daniel Myers | General Partner | Crosslink Capital | linkedin.com/in/danielmyers | 2nd | 2025-01-27 | 14:30 | Pending | Yes | No | - | Yes | Wait 1 week |
```

**Documentation Process:**
1. **Before starting**: Check existing tracking files for duplicates
2. **During analysis**: Add disqualified VCs to `linkedin_disqualified_vcs.md`
3. **After sending**: Add sent requests to `linkedin_sent_vc_requests.md` immediately
4. **End of session**: Update `vc_contacts_log.md` with session summary
5. **Weekly review**: Check for responses and update all tracking files

**File Location**: Save in `/vc_outreach/logs/` directory

## Tracking System Workflow

### File Structure
```
vc_outreach/
├── linkedin_disqualified_vcs.md        # All disqualified VC profiles
├── linkedin_sent_vc_requests.md        # All sent connection requests  
├── vc_contacts_log.md                  # Main campaign tracking
├── linkedin_vc_outreach_prompt.md      # This prompt file
├── today_session_log.md                # Today's session tracking
└── logs/                               # Detailed session logs
```

### Workflow Steps
1. **Start Session**: Open both tracking files in separate tabs
2. **Create Today's Log**: Initialize daily session tracking
3. **For Each VC Candidate**:
   - Check `linkedin_disqualified_vcs.md` for their name
   - Check `linkedin_sent_vc_requests.md` quick reference list
   - If found in either: Skip candidate
   - If not found: Proceed with analysis
4. **After Analysis**:
   - If disqualified: Add to `linkedin_disqualified_vcs.md`
   - If qualified and sent: Add to `linkedin_sent_vc_requests.md`
   - Update today's session log
5. **End Session**: Complete today's log with final statistics

### Quick Reference Format
- **Disqualified**: Name, Firm, Reason, Date
- **Sent Requests**: Name, Firm, Status, Response
- **Today's Log**: Real-time session progress tracking

## Campaign Execution Tips

### Best Practices
- **Check tracking files first**: Always check disqualified and sent request files before analyzing
- **Maintain daily log**: Update today's session log after each contact
- **Quality over quantity**: Focus on relevant, high-quality targets
- **Systematic approach**: Work through search results methodically
- **Consistent messaging**: Use the exact template for consistency
- **Track everything**: Update tracking files immediately during the process
- **Avoid duplicates**: Never analyze or contact the same VC twice

### What to Avoid
- Don't use InMail (saves credits)
- Don't send generic connection requests without notes
- Don't target 3rd+ connections if 2nd degree options available
- Don't modify the proven message template significantly

### Success Metrics
- **Response rate**: Track acceptance vs. total invitations
- **Engagement**: Monitor who views your profile after connecting
- **Follow-up opportunities**: Note VCs who respond positively
- **Meeting requests**: Ultimate goal is securing intro calls

## Sample Successful Targets
Based on previous campaign:
- **Steven Xi** - Co-Founder and Managing Partner at Eastlink Capital
- **Vishal Arora** - Founder and Managing Partner at PanCosmic Capital  
- **Stephane Longuet** - Managing Partner at Convivialité Ventures
- **Wen H. Hsieh, Ph.D.** - Founding Managing Partner at Matter Venture Partners
- **Rana S. Mookherjee** - Founder and Managing Partner at Stochastic Capital

## Campaign Goals
- **Primary**: Build network of VC connections for future fundraising
- **Secondary**: Generate awareness for Opius AI among investment community
- **Tertiary**: Identify potential early adopters or advisors

## Follow-up Strategy
After connections are accepted:
1. Thank them for connecting
2. Share relevant company updates
3. Offer product demos when appropriate
4. Request intro calls for qualified prospects

---

**Last Updated**: January 2025
**Success Rate**: High (based on previous campaigns)
**Recommended Frequency**: Monthly campaigns with different search terms 