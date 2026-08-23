"""
Search the web for company career pages matching a candidate's skills and
target job role. Uses the Adzuna API for comprehensive global job listings.
Falls back to a curated list if the API keys are missing or the API is unavailable.
"""
from typing import List, Dict
import httpx
from app.core.config import settings

CURATED_FALLBACK = [
    {"company_name": "Google", "career_url": "https://careers.google.com", "source": "curated"},
    {"company_name": "Microsoft", "career_url": "https://careers.microsoft.com", "source": "curated"},
    {"company_name": "Amazon", "career_url": "https://www.amazon.jobs", "source": "curated"},
    {"company_name": "Atlassian", "career_url": "https://www.atlassian.com/company/careers", "source": "curated"},
    {"company_name": "Stripe", "career_url": "https://stripe.com/jobs", "source": "curated"},
]


def search_career_pages(job_role: str, skills: List[str], limit: int = 10, exclude_companies: List[str] = None) -> List[Dict]:
    if exclude_companies is None:
        exclude_companies = []

    results: List[Dict] = []
    seen_companies = {c.lower() for c in exclude_companies}
    
    app_id = settings.ADZUNA_APP_ID
    app_key = settings.ADZUNA_APP_KEY

    if app_id and app_key:
        try:
            resp = httpx.get(
                "https://api.adzuna.com/v1/api/jobs/in/search/1",
                params={
                    "app_id": app_id,
                    "app_key": app_key,
                    "results_per_page": 50,
                    "what": job_role,
                    "content-type": "application/json"
                },
                timeout=10.0,
            )
            if resp.status_code == 200:
                data = resp.json()
                jobs = data.get("results", [])
                for job in jobs:
                    if len(results) >= limit:
                        break
                    href = job.get("redirect_url")
                    if not href:
                        continue
                    company = job.get("company", {})
                    company_name = company.get("display_name", "Unknown Company")[:100]
                    if company_name.lower() in seen_companies:
                        continue
                    
                    seen_companies.add(company_name.lower())
                    results.append(
                        {
                            "company_name": company_name,
                            "career_url": href,
                            "role": job.get("title", job_role)[:100],
                            "source": "adzuna_api",
                        }
                    )
        except Exception:
            pass

    # ATS Fallbacks / Additions
    ats_companies = {
        "lever": [
            "spotify", "wealthfront", "canva", "palantir", "hopper", "yelp", 
            "twitch", "framer", "kiva", "coursera"
        ],
        "greenhouse": [
            "databricks", "datadoghq", "elastic", "figma", "airbnb", "reddit", 
            "stripe", "gitlab", "discord", "plaid", "dropbox", "doordash", 
            "pinterest", "wayfair", "robinhood", "instacart", "coinbase", "brex"
        ],
        "ashby": [
            "notion", "linear", "vercel", "replit", "anthropic", "ramp", 
            "drata", "fivetran", "clickup", "gem", "ironclad"
        ]
    }

    # Lever
    for company in ats_companies["lever"]:
        if company.lower() in seen_companies: continue
        if len(results) >= limit: break
        try:
            url = settings.LEVER_API_URL.format(company=company)
            resp = httpx.get(url, timeout=5.0)
            if resp.status_code == 200:
                for job in resp.json():
                    title = job.get("text", "")
                    if any(word in title.lower() for word in job_role.lower().split()) or job_role.lower() in title.lower():
                        results.append({
                            "company_name": company.capitalize(),
                            "career_url": job.get("hostedUrl"),
                            "role": title,
                            "source": "lever"
                        })
                        seen_companies.add(company.lower())
                        break
        except Exception:
            pass

    # Greenhouse
    for company in ats_companies["greenhouse"]:
        if company.lower() in seen_companies: continue
        if len(results) >= limit: break
        try:
            url = settings.GREENHOUSE_API_URL.format(company=company)
            resp = httpx.get(url, timeout=5.0)
            if resp.status_code == 200:
                for job in resp.json().get("jobs", []):
                    title = job.get("title", "")
                    if any(word in title.lower() for word in job_role.lower().split()) or job_role.lower() in title.lower():
                        results.append({
                            "company_name": company.capitalize(),
                            "career_url": job.get("absolute_url"),
                            "role": title,
                            "source": "greenhouse"
                        })
                        seen_companies.add(company.lower())
                        break
        except Exception:
            pass

    # Ashby
    for company in ats_companies["ashby"]:
        if company.lower() in seen_companies: continue
        if len(results) >= limit: break
        try:
            url = settings.ASHBY_API_URL.format(company=company)
            resp = httpx.get(url, timeout=5.0)
            if resp.status_code == 200:
                for job in resp.json().get("jobs", []):
                    title = job.get("title", "")
                    if any(word in title.lower() for word in job_role.lower().split()) or job_role.lower() in title.lower():
                        results.append({
                            "company_name": company.capitalize(),
                            "career_url": job.get("jobUrl"),
                            "role": title,
                            "source": "ashby"
                        })
                        seen_companies.add(company.lower())
                        break
        except Exception:
            pass

    if not results:
        results = CURATED_FALLBACK
        for r in results:
            r["role"] = job_role

    return results[:limit]
