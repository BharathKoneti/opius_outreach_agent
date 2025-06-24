# AI Startup Investor Research

This project helps search through investors who are currently funding AI startups.

## Features

- Sample data of prominent venture capital firms and their recent AI investments
- Filtering capabilities to find investors focused on AI
- Export results to CSV for further analysis

## Setup

1. Install dependencies:
```
pip install -r requirements.txt
```

2. Run the script:
```
python investor_search.py
```

## Sample Data

The current implementation includes sample data for 10 major VC firms with their AI investments. In a production environment, this would be replaced with real-time data from sources like:

- Crunchbase API
- PitchBook
- CB Insights
- DealRoom

## Future Enhancements

- Add real API integration with Crunchbase or similar platforms
- Include investment amount data
- Add filtering by investment stage (seed, Series A, etc.)
- Create a web dashboard for easier exploration 