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


def search_career_pages(job_role: str, skills: List[str], limit: int = 10) -> List[Dict]:
    results: List[Dict] = []
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
                seen_companies = set()
                for job in jobs:
                    if len(results) >= limit:
                        break
                    href = job.get("redirect_url")
                    if not href:
                        continue
                    company = job.get("company", {})
                    company_name = company.get("display_name", "Unknown Company")[:100]
                    if company_name in seen_companies:
                        continue
                    
                    seen_companies.add(company_name)
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

    if not results:
        results = CURATED_FALLBACK
        for r in results:
            r["role"] = job_role

    return results[:limit]
