HIT KENYA MEDIA — BECOME A WRITER UPDATE
=========================================

INCLUDED FILES
- media-articles-blogs.html : Updates the CTA from BECOME A PARTNER to BECOME A WRITER
- media-become-a-writer.html : New writer / entertainment article submission page
- assets/articles-blogs/editorial.webp : Local editorial photograph for the writer page

INSTALL ON GITHUB PAGES
1. Extract this ZIP.
2. Upload the two HTML files to the same folder as your existing media-articles-blogs.html.
3. Upload assets/articles-blogs/editorial.webp preserving the directory structure.
4. Commit changes. Refresh the published site after GitHub Pages deploys.
5. All other pages and navigation are untouched.

IMPORTANT: ARTICLE UPLOADS
The page has working local file selection, validation and a downloadable submission summary.
It DOES NOT deliver articles online until a verified, HTTPS file-upload backend is connected.
GitHub Pages is static hosting; it cannot accept submitted files by itself.

To enable actual uploads:
- Set SUBMISSION_ENDPOINT in media-become-a-writer.html to an HTTPS endpoint that accepts multipart/form-data (including files), sends it to your editorial team and supports browser cross-origin requests.
- Test it end-to-end with a sample article and attachment before announcing submissions.
- Configure your privacy policy, spam protection, consent and secure file retention on that backend.
- Never paste API secrets into client-side HTML or JavaScript.

The "DOWNLOAD MY SUBMISSION" button downloads writer details and pasted article text only; uploaded file attachments remain on the visitor's device.

No existing website backend, email address or published articles were changed.
