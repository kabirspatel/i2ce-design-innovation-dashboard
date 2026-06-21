# I2CE Design Innovation Workspace

A dependency-free project workspace for the twelve-phase I2CE Cradle-to-Cradle Design Innovation Framework.

The dashboard connects project work, structured notebook entries, literature and market research, versioned protocols, virtual and real experiment runs, requirements, materials, knowledge records, and phase-gate readiness through one shared browser data model.

Open `index.html` directly or serve the folder locally:

```sh
python3 -m http.server 8080
```

Data is stored in browser `localStorage`. Use **Project knowledge -> Data lake package** to export typed schema `3.0` objects with relationships, tags, provenance, and attachment metadata.

See [WORKFLOW_GUIDE.md](WORKFLOW_GUIDE.md) for user instructions, research and notebook methods, upload handling, phase gates, data-lake handoff, and the security boundary.

This GitHub Pages build is a public product prototype. Browser storage is not a compliant research-data backend; do not enter confidential, regulated, or production data.
