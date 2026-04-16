# ☁️ Dynamic Web CloudFormation

A dynamic web application deployed on AWS using CloudFormation Infrastructure-as-Code.

## Architecture

```
Client → Node.js Server → AWS CloudFormation Stack
                └── public/ (static assets: HTML, CSS, JS)
```

## Tech Stack

- **Runtime:** Node.js
- **Frontend:** HTML, CSS, JavaScript
- **Infrastructure:** AWS CloudFormation
- **IaC Template:** `dynamic-website.yaml`

## Project Structure

```
├── server.js              # Node.js application server
├── dynamic-website.yaml   # CloudFormation template
├── public/                # Static frontend assets
├── package.json           # Dependencies
└── .gitignore
```

## Getting Started

### Local Development

```bash
npm install
node server.js
```

### AWS Deployment

Deploy the CloudFormation stack:

```bash
aws cloudformation create-stack \
  --stack-name dynamic-web \
  --template-body file://dynamic-website.yaml
```

## Languages

- JavaScript (78.5%)
- HTML (12.8%)
- CSS (8.7%)
