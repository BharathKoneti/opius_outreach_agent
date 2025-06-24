import json
import requests
import os
from bs4 import BeautifulSoup
from dotenv import load_dotenv

load_dotenv()  # Load environment variables

def fetch_crunchbase_investors():
    """
    Simulate fetching investor data from Crunchbase
    In a real application, you would use the Crunchbase API with proper authentication
    """
    # This is sample data - in a real app, you would fetch from Crunchbase API
    investors = [
        {"name": "Sequoia Capital", "focus_areas": ["AI", "Machine Learning", "SaaS"], "recent_investments": ["Anthropic", "Databricks", "Cohere"]},
        {"name": "Andreessen Horowitz", "focus_areas": ["AI", "Crypto", "Fintech"], "recent_investments": ["OpenAI", "Inflection AI", "Adept AI"]},
        {"name": "Y Combinator", "focus_areas": ["SaaS", "B2B", "AI"], "recent_investments": ["Vapi.ai", "Glean", "Harvey"]},
        {"name": "Google Ventures", "focus_areas": ["Healthcare", "AI", "Enterprise"], "recent_investments": ["Runway", "Anthropic", "Elicit"]},
        {"name": "Khosla Ventures", "focus_areas": ["Climate", "AI", "Health"], "recent_investments": ["OpenAI", "Anthropic", "Twelve Labs"]},
        {"name": "Tiger Global", "focus_areas": ["SaaS", "Fintech", "E-commerce"], "recent_investments": ["Databricks", "Waymo", "Scale AI"]},
        {"name": "SoftBank Vision Fund", "focus_areas": ["AI", "Mobility", "E-commerce"], "recent_investments": ["SambaNova Systems", "Groq", "Nuro"]},
        {"name": "Insight Partners", "focus_areas": ["SaaS", "Security", "Data"], "recent_investments": ["ContractPodAi", "Weights & Biases", "Stability AI"]},
        {"name": "Coatue Management", "focus_areas": ["AI", "Enterprise", "Consumer"], "recent_investments": ["Hugging Face", "Scale AI", "Anthropic"]},
        {"name": "NEA", "focus_areas": ["Healthcare", "Enterprise", "AI"], "recent_investments": ["MosaicML", "Databricks", "Inflection AI"]}
    ]
    return investors

def search_ai_investors(investors, min_ai_investments=1):
    """
    Search for investors who are actively investing in AI startups
    """
    ai_investors = []
    
    for investor in investors:
        # Check if AI is in their focus areas
        if "AI" in investor["focus_areas"] or "Machine Learning" in investor["focus_areas"]:
            # Count AI-related investments
            ai_investment_count = sum(1 for investment in investor["recent_investments"] 
                                      if "AI" in investment or "ML" in investment or 
                                      "GPT" in investment or "LLM" in investment or
                                      "Intelligence" in investment)
            
            if ai_investment_count >= min_ai_investments:
                investor["ai_investment_count"] = ai_investment_count
                ai_investors.append(investor)
    
    # Sort by number of AI investments
    return sorted(ai_investors, key=lambda x: x["ai_investment_count"], reverse=True)

def display_investors(investors):
    """
    Display information about investors in a readable format
    """
    if not investors:
        print("No investors found matching your criteria.")
        return
    
    print(f"\n{'=' * 60}")
    print(f"{'INVESTORS ACTIVELY FUNDING AI STARTUPS':^60}")
    print(f"{'=' * 60}")
    
    for idx, investor in enumerate(investors, 1):
        print(f"\n{idx}. {investor['name']}")
        print(f"   Focus Areas: {', '.join(investor['focus_areas'])}")
        print(f"   Recent AI Investments: {', '.join(investor['recent_investments'])}")
        print(f"   AI Investment Count: {investor['ai_investment_count']}")
        print(f"   {'-' * 50}")

def export_to_csv(investors, filename="ai_investors.csv"):
    """
    Export investors data to a CSV file without using pandas
    """
    if not investors:
        return
    
    # Get all possible keys from all investors
    keys = set()
    for investor in investors:
        keys.update(investor.keys())
    
    # Convert sets to string for CSV
    for investor in investors:
        if "focus_areas" in investor:
            investor["focus_areas"] = ", ".join(investor["focus_areas"])
        if "recent_investments" in investor:
            investor["recent_investments"] = ", ".join(investor["recent_investments"])
    
    # Write to CSV
    with open(filename, "w") as f:
        # Write header
        f.write(",".join(keys) + "\n")
        
        # Write data
        for investor in investors:
            row = [str(investor.get(key, "")) for key in keys]
            f.write(",".join(row) + "\n")
    
    print(f"\nData exported to {filename}")

def main():
    print("Fetching investor data...")
    investors = fetch_crunchbase_investors()
    
    print(f"Found {len(investors)} total investors")
    ai_investors = search_ai_investors(investors)
    
    print(f"Found {len(ai_investors)} investors actively funding AI startups")
    display_investors(ai_investors)
    
    # Export to CSV
    if ai_investors:
        export_to_csv(ai_investors)

if __name__ == "__main__":
    main() 