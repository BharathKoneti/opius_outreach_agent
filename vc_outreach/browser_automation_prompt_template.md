# Browser Automation Outreach Campaign Template

## General Instructions for AI Assistant

### Campaign Setup
When asked to run an outreach campaign, follow this systematic approach:

1. **Load the target website/platform**
2. **Navigate to search functionality**
3. **Execute search strategy**
4. **Identify and qualify targets**
5. **Execute outreach actions**
6. **Track and document results**

### Browser Navigation Best Practices

#### Initial Setup
```
1. Navigate to the platform (e.g., LinkedIn, Twitter, etc.)
2. Take a snapshot to understand the current page state
3. Identify login status and required actions
4. Navigate to search functionality
```

#### Search Execution
```
1. Use platform-specific search terms
2. Apply relevant filters (location, industry, role, etc.)
3. Systematically work through search results
4. Take snapshots to understand page structure
```

#### Target Qualification
```
1. Prioritize targets based on campaign criteria
2. Check connection status/accessibility
3. Verify target relevance (title, company, activity)
4. Identify available action buttons (Connect, Follow, Message)
```

#### Outreach Execution
```
1. Click appropriate action button
2. Add personalized message when prompted
3. Use proven message templates
4. Confirm successful action completion
5. Document results immediately
```

### Message Template Framework

#### Template Structure
```
Hi [NAME], [COMPANY_INTRO] [VALUE_PROPOSITION] [CALL_TO_ACTION] [LINKS] [CLOSING]
```

#### Template Variables
- `[NAME]`: Target's first name
- `[COMPANY_INTRO]`: Brief company introduction
- `[VALUE_PROPOSITION]`: What you're building/offering
- `[CALL_TO_ACTION]`: Specific ask or next step
- `[LINKS]`: Relevant URLs (website, demo, etc.)
- `[CLOSING]`: Professional closing

#### Character Limits by Platform
- **LinkedIn Connection Note**: 300 characters
- **Twitter DM**: 10,000 characters
- **LinkedIn InMail**: 2,000 characters
- **Email**: No strict limit (aim for concise)

### Tracking & Documentation

#### Required Tracking Fields
```
- Target Name
- Title/Role
- Company
- Platform
- Connection Status
- Date Contacted
- Message Sent
- Response Status
- Follow-up Notes
```

#### Documentation Format
Create a markdown file with:
```markdown
# [Campaign Name] - [Date]

## Campaign Summary
- **Objective**: [Goal]
- **Platform**: [Platform name]
- **Target Audience**: [Description]
- **Total Contacted**: [Number]

## Results
| Name | Title | Company | Status | Date | Notes |
|------|-------|---------|--------|------|-------|
| ... | ... | ... | ... | ... | ... |

## Key Insights
- [Insight 1]
- [Insight 2]
- [Next steps]
```

### Error Handling & Recovery

#### Common Issues & Solutions
1. **Page not loading**: Refresh and retry
2. **Elements not found**: Take snapshot and reassess
3. **Rate limiting**: Pause and resume later
4. **Login required**: Prompt user for authentication
5. **Captcha/verification**: Alert user for manual intervention

#### Retry Logic
```
1. First attempt: Execute action
2. If failed: Take snapshot and analyze
3. Second attempt: Adjust approach based on page state
4. If still failed: Document issue and move to next target
```

### Campaign Optimization

#### A/B Testing Framework
- Test different message templates
- Compare response rates across target segments
- Optimize search terms and filters
- Track engagement metrics

#### Success Metrics
- **Outreach Volume**: Total contacts made
- **Response Rate**: Positive responses / Total sent
- **Conversion Rate**: Meetings booked / Responses
- **Platform Efficiency**: Success rate by platform

### Compliance & Best Practices

#### Platform Guidelines
- Respect rate limits and daily quotas
- Use authentic, personalized messaging
- Avoid spam-like behavior
- Follow platform terms of service

#### Professional Standards
- Maintain professional tone
- Provide clear value proposition
- Include easy opt-out options
- Follow up appropriately

---

## Usage Instructions

To use this template:

1. **Customize the campaign-specific variables**
2. **Define your target criteria**
3. **Prepare your message template**
4. **Set up tracking documentation**
5. **Execute the campaign systematically**
6. **Analyze results and optimize**

## Example Campaign Prompts

### LinkedIn VC Outreach
```
Execute a LinkedIn VC outreach campaign targeting General Partners and Managing Partners. Use connection invitations with personalized notes. Avoid InMail to save credits. Focus on 2nd degree connections. Target: 20 VCs. Message template: [specific template]. Track results in vc_outreach/campaign_log.md
```

### Twitter Influencer Outreach
```
Execute a Twitter outreach campaign targeting AI/tech influencers with 10K+ followers. Use direct messages. Target: 15 influencers. Message template: [specific template]. Track results in twitter_outreach/campaign_log.md
```

### Reddit Community Engagement
```
Execute a Reddit outreach campaign in AI/startup communities. Focus on valuable content sharing and community engagement. Target: 10 relevant posts/communities. Track results in reddit_outreach/campaign_log.md
```

---

**Template Version**: 1.0
**Last Updated**: June 2025
**Compatibility**: Browser automation tools, AI assistants 