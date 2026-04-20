# Re-enabling the monthly auto-post cron

The `crons` array in `vercel.json` was temporarily emptied on 2026-04-20 to unblock a Vercel build that was failing with:

```
Error: The `CRON_SECRET` environment variable contains leading or trailing
whitespace, which is not allowed in HTTP header values.
```

Vercel validates `CRON_SECRET` at **build time** when `crons` is non-empty, because it needs the secret to build the `Authorization: Bearer …` header for cron calls. Leading/trailing whitespace is rejected by HTTP header validators.

## To re-enable

1. Open **Vercel → blackarrow → Settings → Environment Variables**.
2. Find `CRON_SECRET`. Click edit.
3. Delete the value entirely, then **re-type or re-paste** it cleanly — make sure there is no leading/trailing space, tab, or newline. (Easiest test: paste into a plain text editor first and check the character count matches what you expect.)
4. Save.
5. Restore `vercel.json` to:

   ```json
   {
     "crons": [
       { "path": "/api/cron/generate-monthly-post", "schedule": "0 9 1 * *" }
     ]
   }
   ```

6. Commit + push. The build should pass and the cron will resume running on the 1st of each month at 09:00 UTC.

## Notes

- The route at `app/api/cron/generate-monthly-post/route.ts` is **still deployed** — it just isn't scheduled. You can invoke it manually any time with:

  ```sh
  curl -H "Authorization: Bearer <CRON_SECRET>" \
       https://www.blackarrow.co/api/cron/generate-monthly-post
  ```

- The route now calls `.trim()` on both the stored secret and the incoming `Authorization` header defensively, so a future whitespace slip in Vercel won't silently break auth at runtime. (The build-time validator is stricter and still requires clean input, which is why the vercel.json workaround was needed.)
