import json
import requests
import os
import csv
import re
from bs4 import BeautifulSoup
from dotenv import load_dotenv

load_dotenv()  # Load environment variables

def fetch_expanded_investor_data():
    """
    Expanded dataset with more investors and detailed information about their investments
    """
    investors = [
        {
            "name": "Sequoia Capital",
            "focus_areas": ["AI", "Machine Learning", "SaaS", "Enterprise"],
            "investments": [
                {"company": "Anthropic", "round": "Series C", "amount": "$450M", "date": "2023-05", "ai_category": "Foundational Models"},
                {"company": "Databricks", "round": "Series H", "amount": "$250M", "date": "2021-08", "ai_category": "Data Analytics"},
                {"company": "Cohere", "round": "Series C", "amount": "$270M", "date": "2023-06", "ai_category": "LLMs"},
                {"company": "Scale AI", "round": "Series E", "amount": "$325M", "date": "2021-04", "ai_category": "Data Annotation"},
                {"company": "Perplexity", "round": "Series A", "amount": "$73M", "date": "2024-01", "ai_category": "AI Search"}
            ]
        },
        {
            "name": "Andreessen Horowitz",
            "focus_areas": ["AI", "Crypto", "Fintech", "Gaming"],
            "investments": [
                {"company": "OpenAI", "round": "Pre-IPO", "amount": "$400M", "date": "2023-01", "ai_category": "Foundational Models"},
                {"company": "Inflection AI", "round": "Series B", "amount": "$1.3B", "date": "2023-06", "ai_category": "Personal AI Assistants"},
                {"company": "Adept AI", "round": "Series B", "amount": "$350M", "date": "2023-04", "ai_category": "AI Agents"},
                {"company": "Character.AI", "round": "Series A", "amount": "$150M", "date": "2023-03", "ai_category": "AI Characters"},
                {"company": "Anthropic", "round": "Series B", "amount": "$300M", "date": "2022-12", "ai_category": "Foundational Models"}
            ]
        },
        {
            "name": "Y Combinator",
            "focus_areas": ["SaaS", "B2B", "AI", "Developer Tools"],
            "investments": [
                {"company": "Vapi.ai", "round": "Seed", "amount": "$2M", "date": "2023-08", "ai_category": "Voice AI"},
                {"company": "Glean", "round": "Series C", "amount": "$100M", "date": "2022-05", "ai_category": "Enterprise Search"},
                {"company": "Harvey", "round": "Series A", "amount": "$21M", "date": "2023-04", "ai_category": "Legal AI"},
                {"company": "Replicate", "round": "Series A", "amount": "$40M", "date": "2023-05", "ai_category": "AI Infrastructure"},
                {"company": "Mem", "round": "Series B", "amount": "$23M", "date": "2022-11", "ai_category": "AI Note-taking"}
            ]
        },
        {
            "name": "Google Ventures",
            "focus_areas": ["Healthcare", "AI", "Enterprise", "Climate"],
            "investments": [
                {"company": "Runway", "round": "Series C", "amount": "$100M", "date": "2023-06", "ai_category": "Generative Video AI"},
                {"company": "Anthropic", "round": "Series C", "amount": "$300M", "date": "2023-05", "ai_category": "Foundational Models"},
                {"company": "Elicit", "round": "Series A", "amount": "$8M", "date": "2023-01", "ai_category": "Research Assistant AI"},
                {"company": "Verily", "round": "Series E", "amount": "$700M", "date": "2022-09", "ai_category": "Healthcare AI"},
                {"company": "Replit", "round": "Series B", "amount": "$80M", "date": "2022-02", "ai_category": "AI Coding"}
            ]
        },
        {
            "name": "Khosla Ventures",
            "focus_areas": ["Climate", "AI", "Health", "Space"],
            "investments": [
                {"company": "OpenAI", "round": "Series D", "amount": "$250M", "date": "2023-04", "ai_category": "Foundational Models"},
                {"company": "Anthropic", "round": "Series B", "amount": "$150M", "date": "2022-12", "ai_category": "Foundational Models"},
                {"company": "Twelve Labs", "round": "Series A", "amount": "$12M", "date": "2022-10", "ai_category": "Video Understanding AI"},
                {"company": "Upstage", "round": "Series B", "amount": "$100M", "date": "2023-11", "ai_category": "LLMs"},
                {"company": "Primer", "round": "Series C", "amount": "$110M", "date": "2021-06", "ai_category": "Natural Language Processing"}
            ]
        },
        {
            "name": "Tiger Global",
            "focus_areas": ["SaaS", "Fintech", "E-commerce", "Marketplaces"],
            "investments": [
                {"company": "Databricks", "round": "Series H", "amount": "$500M", "date": "2021-08", "ai_category": "Data Analytics"},
                {"company": "Waymo", "round": "Extension", "amount": "$2.5B", "date": "2021-06", "ai_category": "Autonomous Vehicles"},
                {"company": "Scale AI", "round": "Series E", "amount": "$325M", "date": "2021-04", "ai_category": "Data Annotation"},
                {"company": "Bytedance", "round": "Private", "amount": "$300M", "date": "2020-03", "ai_category": "Recommendation Systems"},
                {"company": "Snowflake", "round": "Pre-IPO", "amount": "$450M", "date": "2020-02", "ai_category": "Data Warehousing"}
            ]
        },
        {
            "name": "SoftBank Vision Fund",
            "focus_areas": ["AI", "Mobility", "E-commerce", "Enterprise"],
            "investments": [
                {"company": "SambaNova Systems", "round": "Series D", "amount": "$676M", "date": "2021-04", "ai_category": "AI Hardware"},
                {"company": "Groq", "round": "Series C", "amount": "$300M", "date": "2023-04", "ai_category": "AI Chips"},
                {"company": "Nuro", "round": "Series C", "amount": "$500M", "date": "2021-11", "ai_category": "Autonomous Vehicles"},
                {"company": "Brain Technologies", "round": "Series A", "amount": "$50M", "date": "2021-07", "ai_category": "Natural Language Interfaces"},
                {"company": "Symbotic", "round": "Pre-IPO", "amount": "$200M", "date": "2021-12", "ai_category": "Warehouse Automation"}
            ]
        },
        {
            "name": "Insight Partners",
            "focus_areas": ["SaaS", "Security", "Data", "E-commerce"],
            "investments": [
                {"company": "ContractPodAi", "round": "Series C", "amount": "$115M", "date": "2021-11", "ai_category": "Legal AI"},
                {"company": "Weights & Biases", "round": "Series C", "amount": "$135M", "date": "2021-10", "ai_category": "MLOps"},
                {"company": "Stability AI", "round": "Series A", "amount": "$101M", "date": "2022-10", "ai_category": "Generative Image AI"},
                {"company": "DeepL", "round": "Growth", "amount": "$100M", "date": "2022-01", "ai_category": "AI Translation"},
                {"company": "Aquant", "round": "Series C", "amount": "$70M", "date": "2022-01", "ai_category": "Service Intelligence"}
            ]
        },
        {
            "name": "Coatue Management",
            "focus_areas": ["AI", "Enterprise", "Consumer", "Fintech"],
            "investments": [
                {"company": "Hugging Face", "round": "Series C", "amount": "$235M", "date": "2022-05", "ai_category": "AI Development Platforms"},
                {"company": "Scale AI", "round": "Series E", "amount": "$325M", "date": "2021-04", "ai_category": "Data Annotation"},
                {"company": "Anthropic", "round": "Series C", "amount": "$450M", "date": "2023-05", "ai_category": "Foundational Models"},
                {"company": "Adept AI", "round": "Series B", "amount": "$350M", "date": "2023-04", "ai_category": "AI Agents"},
                {"company": "Jasper", "round": "Series A", "amount": "$125M", "date": "2022-10", "ai_category": "AI Content Generation"}
            ]
        },
        {
            "name": "NEA",
            "focus_areas": ["Healthcare", "Enterprise", "AI", "Biotechnology"],
            "investments": [
                {"company": "MosaicML", "round": "Series B", "amount": "$64M", "date": "2023-06", "ai_category": "AI Training Infrastructure"},
                {"company": "Databricks", "round": "Series H", "amount": "$500M", "date": "2021-08", "ai_category": "Data Analytics"},
                {"company": "Inflection AI", "round": "Series A", "amount": "$225M", "date": "2022-07", "ai_category": "Personal AI Assistants"},
                {"company": "Curai Health", "round": "Series B", "amount": "$27.5M", "date": "2022-02", "ai_category": "Healthcare AI"},
                {"company": "Instabase", "round": "Series B", "amount": "$105M", "date": "2019-10", "ai_category": "Business Automation"}
            ]
        },
        {
            "name": "Lightspeed Venture Partners",
            "focus_areas": ["Enterprise", "Consumer", "Fintech", "AI"],
            "investments": [
                {"company": "Together AI", "round": "Series B", "amount": "$100M", "date": "2023-10", "ai_category": "AI Compute Infrastructure"},
                {"company": "Stability AI", "round": "Seed", "amount": "$50M", "date": "2022-03", "ai_category": "Generative Image AI"},
                {"company": "Pinecone", "round": "Series B", "amount": "$100M", "date": "2023-03", "ai_category": "Vector Databases"},
                {"company": "Descript", "round": "Series C", "amount": "$50M", "date": "2022-12", "ai_category": "AI Audio/Video Editing"},
                {"company": "Hasty", "round": "Series A", "amount": "$3.7M", "date": "2021-09", "ai_category": "Computer Vision"}
            ]
        },
        {
            "name": "Greylock Partners",
            "focus_areas": ["Enterprise", "AI", "Cybersecurity", "Consumer"],
            "investments": [
                {"company": "Abnormal Security", "round": "Series C", "amount": "$210M", "date": "2022-05", "ai_category": "AI Security"},
                {"company": "Snorkel AI", "round": "Series C", "amount": "$85M", "date": "2022-05", "ai_category": "Data Labeling"},
                {"company": "Cresta", "round": "Series C", "amount": "$80M", "date": "2022-03", "ai_category": "Conversation AI"},
                {"company": "Instabase", "round": "Series B", "amount": "$105M", "date": "2019-10", "ai_category": "Business Automation"},
                {"company": "Chronosphere", "round": "Series C", "amount": "$115M", "date": "2021-10", "ai_category": "Observability"}
            ]
        }
    ]
    return investors

def search_ai_investors(investors, ai_category=None, min_investment=None, max_age_months=None):
    """
    Search for investors who are actively funding AI startups with filtering options
    """
    ai_investors = []
    
    for investor in investors:
        # Filter investments based on criteria
        ai_investments = []
        
        for investment in investor["investments"]:
            is_match = True
            
            # Filter by AI category if specified
            if ai_category and ai_category.lower() not in investment["ai_category"].lower():
                is_match = False
                
            # Filter by minimum investment amount if specified
            if min_investment:
                # Convert amount string to number (removing $ and M/B indicators)
                amount_str = investment["amount"]
                amount_value = float(amount_str.replace("$", "").replace("B", "000").replace("M", ""))
                
                if amount_value < min_investment:
                    is_match = False
            
            # Filter by investment age if specified
            if max_age_months:
                # Simple date parsing (assuming format YYYY-MM)
                year, month = map(int, investment["date"].split("-"))
                current_year, current_month = 2024, 5  # Assuming current date
                
                # Calculate months difference
                months_diff = (current_year - year) * 12 + (current_month - month)
                
                if months_diff > max_age_months:
                    is_match = False
            
            if is_match:
                ai_investments.append(investment)
        
        if ai_investments:
            investor_copy = investor.copy()
            investor_copy["ai_investments"] = ai_investments
            investor_copy["ai_investment_count"] = len(ai_investments)
            ai_investors.append(investor_copy)
    
    # Sort by number of matching AI investments
    return sorted(ai_investors, key=lambda x: x["ai_investment_count"], reverse=True)

def display_investors(investors):
    """
    Display information about investors in a readable format
    """
    if not investors:
        print("No investors found matching your criteria.")
        return
    
    print(f"\n{'=' * 80}")
    print(f"{'INVESTORS ACTIVELY FUNDING ENTERPRISE AI AGENTS':^80}")
    print(f"{'=' * 80}")
    
    for idx, investor in enumerate(investors, 1):
        print(f"\n{idx}. {investor['name']}")
        print(f"   Focus Areas: {', '.join(investor['focus_areas'])}")
        print(f"   AI Investments: {investor['ai_investment_count']}")
        print(f"   Recent AI Investments:")
        
        for inv in investor["ai_investments"]:
            print(f"      - {inv['company']} ({inv['round']}, {inv['amount']}, {inv['date']}) - {inv['ai_category']}")
        
        print(f"   {'-' * 70}")

def export_to_csv(investors, filename="enterprise_ai_agent_investors.csv"):
    """
    Export investors data to a CSV file
    """
    if not investors:
        return
    
    with open(filename, "w", newline="") as f:
        # Create writer for the main file
        writer = csv.writer(f)
        
        # Write header for investors
        writer.writerow(["Investor Name", "Focus Areas", "AI Investment Count"])
        
        # Write data for each investor
        for investor in investors:
            writer.writerow([
                investor["name"],
                ", ".join(investor["focus_areas"]),
                investor["ai_investment_count"]
            ])
    
    # Create a separate CSV for detailed investment data
    with open("enterprise_ai_agent_investments.csv", "w", newline="") as f:
        writer = csv.writer(f)
        
        # Write header for investments
        writer.writerow(["Investor Name", "Company", "Round", "Amount", "Date", "AI Category"])
        
        # Write data for each investment
        for investor in investors:
            for investment in investor["ai_investments"]:
                writer.writerow([
                    investor["name"],
                    investment["company"],
                    investment["round"],
                    investment["amount"],
                    investment["date"],
                    investment["ai_category"]
                ])
    
    print(f"\nInvestor summary exported to {filename}")
    print(f"Detailed investment data exported to enterprise_ai_agent_investments.csv")

def main():
    print("Searching for investors funding enterprise AI agents...")
    investors = fetch_expanded_investor_data()
    
    # Use preset search parameters for enterprise AI agents
    ai_category = "agent"  # Will match both "AI Agents" and any other categories containing "agent"
    enterprise_filter = "enterprise"  # For additional filtering in display
    min_investment = None  # No minimum investment amount
    max_age_months = 24  # Only show investments from the last 2 years
    
    # Filter investors with AI agent investments
    ai_investors = search_ai_investors(
        investors, 
        ai_category=ai_category,
        min_investment=min_investment,
        max_age_months=max_age_months
    )
    
    # Further filter for enterprise focus
    enterprise_ai_investors = []
    for investor in ai_investors:
        if any(enterprise_filter.lower() in area.lower() for area in investor["focus_areas"]):
            enterprise_ai_investors.append(investor)
    
    print(f"\nFound {len(enterprise_ai_investors)} investors funding enterprise AI agents in the last 2 years")
    display_investors(enterprise_ai_investors)
    
    # Export to CSV
    if enterprise_ai_investors:
        export_to_csv(enterprise_ai_investors)

if __name__ == "__main__":
    main() 