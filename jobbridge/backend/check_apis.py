import httpx
import os
from dotenv import load_dotenv

load_dotenv()

job_role = 'Software Engineer'
print('--- Checking Adzuna ---')
app_id = os.getenv('ADZUNA_APP_ID')
app_key = os.getenv('ADZUNA_APP_KEY')
if not app_id or not app_key:
    print('Adzuna keys missing in .env')
else:
    try:
        resp = httpx.get(
            'https://api.adzuna.com/v1/api/jobs/in/search/1',
            params={
                'app_id': app_id,
                'app_key': app_key,
                'results_per_page': 50,
                'what': job_role,
                'content-type': 'application/json'
            },
            timeout=10.0,
        )
        print(f'Adzuna Status: {resp.status_code}')
        if resp.status_code == 200:
            print(f'Adzuna Results: {len(resp.json().get("results", []))}')
    except Exception as e:
        print(f'Adzuna Error: {e}')

ats_companies = {
    'lever': ['canva', 'palantir', 'hopper', 'yelp', 'twitch', 'framer'],
    'greenhouse': ['figma', 'airbnb', 'reddit', 'stripe', 'gitlab', 'discord', 'plaid', 'dropbox', 'doordash'],
    'ashby': ['notion', 'linear', 'vercel', 'replit', 'anthropic', 'ramp', 'drata']
}

print('\n--- Checking Lever ---')
for company in ats_companies['lever']:
    try:
        resp = httpx.get(f'https://api.lever.co/v0/postings/{company}?mode=json', timeout=5.0)
        if resp.status_code == 200:
            jobs = [j for j in resp.json() if job_role.lower() in j.get('text', '').lower()]
            print(f'{company}: {len(jobs)} matches')
        else:
            print(f'{company}: {resp.status_code}')
    except Exception as e:
        print(f'{company}: Error {e}')

print('\n--- Checking Greenhouse ---')
for company in ats_companies['greenhouse']:
    try:
        resp = httpx.get(f'https://boards-api.greenhouse.io/v1/boards/{company}/jobs', timeout=5.0)
        if resp.status_code == 200:
            jobs = [j for j in resp.json().get('jobs', []) if job_role.lower() in j.get('title', '').lower()]
            print(f'{company}: {len(jobs)} matches')
        else:
            print(f'{company}: {resp.status_code}')
    except Exception as e:
        print(f'{company}: Error {e}')

print('\n--- Checking Ashby ---')
for company in ats_companies['ashby']:
    try:
        resp = httpx.get(f'https://api.ashbyhq.com/posting-api/job-board/{company}', timeout=5.0)
        if resp.status_code == 200:
            jobs = [j for j in resp.json().get('jobs', []) if job_role.lower() in j.get('title', '').lower()]
            print(f'{company}: {len(jobs)} matches')
        else:
            print(f'{company}: {resp.status_code}')
    except Exception as e:
        print(f'{company}: Error {e}')
