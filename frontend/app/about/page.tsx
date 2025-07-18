"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Shield, ArrowLeft, Zap, Eye, Lock, Users, CheckCircle, AlertTriangle, XCircle } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  const demoSteps = [
    {
      step: 1,
      title: "Submit a Prompt",
      description: "Enter any AI prompt that might contain sensitive data or require compliance checking.",
      icon: "💬",
    },
    {
      step: 2,
      title: "Risk Assessment",
      description: "The Pre-emptive Risk Assessor analyzes your prompt for potential security and compliance risks.",
      icon: "⚠️",
    },
    {
      step: 3,
      title: "PII Protection",
      description:
        "The Prompt Guard Agent automatically detects and redacts sensitive information like names, addresses, and IDs.",
      icon: "🛡️",
    },
    {
      step: 4,
      title: "Policy Enforcement",
      description:
        "The Policy Enforcer checks your request against regulatory frameworks like GDPR using advanced RAG technology.",
      icon: "⚖️",
    },
    {
      step: 5,
      title: "Response Generation",
      description:
        "If compliant, the system generates a safe response. If not, it provides clear educational feedback.",
      icon: "🤖",
    },
    {
      step: 6,
      title: "Audit Trail",
      description:
        "Every interaction is logged in an immutable audit trail for regulatory compliance and transparency.",
      icon: "📝",
    },
  ]

  const keyFeatures = [
    {
      icon: <Zap className="h-6 w-6 text-aegis-600" />,
      title: "Real-time Processing",
      description: "Dynamic policy enforcement that adapts to your specific context and data sensitivity levels.",
    },
    {
      icon: <Eye className="h-6 w-6 text-aegis-600" />,
      title: "Full Transparency",
      description: "Complete visibility into the governance workflow with our innovative Agent Trace Visualizer.",
    },
    {
      icon: <Lock className="h-6 w-6 text-aegis-600" />,
      title: "Regulatory Compliance",
      description:
        "Built-in support for GDPR, EU AI Act, and other regulatory frameworks through RAG-powered policy checking.",
    },
    {
      icon: <Users className="h-6 w-6 text-aegis-600" />,
      title: "Multi-Agent Architecture",
      description: "Seven specialized AI agents working together to ensure comprehensive governance coverage.",
    },
  ]

  const complianceExamples = [
    {
      status: "approved",
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      title: "Compliant Request",
      example: "Help me write a function to validate email addresses using regex patterns.",
      result: "Request processed normally with standard security checks.",
    },
    {
      status: "modified",
      icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
      title: "PII Redaction",
      example: "Draft an email to John Doe at 123 Main St about invoice #INV-456.",
      result: "PII automatically redacted, template response provided with guidance.",
    },
    {
      status: "blocked",
      icon: <XCircle className="h-5 w-5 text-red-500" />,
      title: "Policy Violation",
      example: "Use German customer data for new marketing campaign.",
      result: "Blocked due to GDPR Article 6 - new purpose requires explicit consent.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-aegis-500 to-aegis-700 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="font-semibold">Project Aegis</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-aegis-500 to-aegis-700 rounded-full flex items-center justify-center">
                <Shield className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-aegis-600 to-aegis-800 bg-clip-text text-transparent">
              About Project Aegis
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A multi-agent AI co-pilot built on Amazon Bedrock that transforms AI governance from a static checklist
              into a dynamic, intelligent defense system for enterprise AI adoption.
            </p>
          </div>

          {/* The Problem */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">The Challenge</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Current AI governance relies on static checklists and manual reviews, creating bottlenecks that slow
                innovation. Enterprises in regulated industries face significant barriers to GenAI adoption due to:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Fear of compliance failures and regulatory fines</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Risk of data privacy breaches involving PII/PHI</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Lack of real-time policy enforcement</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Insufficient audit trails for regulatory requirements</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* The Solution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">The Aegis Solution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                Project Aegis transforms governance from a bottleneck into an enabler through intelligent automation.
                Our multi-agent system provides real-time policy enforcement, educational feedback, and complete
                transparency.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {keyFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-lg border">
                    <div className="flex-shrink-0">{feature.icon}</div>
                    <div>
                      <h4 className="font-semibold mb-2">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* How It Works */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <p className="text-muted-foreground">
                  Aegis employs a sophisticated multi-agent architecture where specialized AI agents collaborate to
                  ensure comprehensive governance coverage:
                </p>

                <div className="space-y-6">
                  {demoSteps.map((step, index) => (
                    <div key={step.step} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{step.icon}</span>
                          <h4 className="font-semibold text-lg">{step.title}</h4>
                        </div>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Compliance Examples */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Compliance in Action</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <p className="text-muted-foreground">
                  See how Aegis handles different types of requests with varying compliance requirements:
                </p>

                <div className="space-y-4">
                  {complianceExamples.map((example, index) => (
                    <div key={index} className="p-4 rounded-lg border">
                      <div className="flex items-center gap-3 mb-3">
                        {example.icon}
                        <h4 className="font-semibold">{example.title}</h4>
                        <Badge variant="outline" className="capitalize">
                          {example.status}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium">Example Request:</span>
                          <p className="text-sm text-muted-foreground italic">"{example.example}"</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Aegis Response:</span>
                          <p className="text-sm text-muted-foreground">{example.result}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Architecture */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Technical Architecture</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                Built on cutting-edge AWS technologies for enterprise-grade performance and scalability:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Core AI Services</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Amazon Bedrock Agents</li>
                    <li>• Bedrock Knowledge Bases</li>
                    <li>• Bedrock Guardrails</li>
                    <li>• Claude 3.5 Sonnet & Titan Models</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Infrastructure</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• AWS Lambda (Serverless)</li>
                    <li>• Amazon S3 (Document Storage)</li>
                    <li>• Amazon QLDB (Audit Logging)</li>
                    <li>• API Gateway (Secure Access)</li>
                  </ul>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold">Frontend Technology</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Next.js 15</Badge>
                  <Badge variant="secondary">React 19</Badge>
                  <Badge variant="secondary">Tailwind v4</Badge>
                  <Badge variant="secondary">shadcn/ui</Badge>
                  <Badge variant="secondary">TypeScript</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <Card className="bg-gradient-to-r from-aegis-50 to-green-50 dark:from-aegis-950 dark:to-green-950 border-aegis-200 dark:border-aegis-800">
            <CardContent className="p-8 text-center space-y-4">
              <h3 className="text-2xl font-bold">Ready to Experience Aegis?</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Try our sample prompts or submit your own to see how intelligent AI governance can transform your
                enterprise AI adoption strategy.
              </p>
              <Link href="/">
                <Button size="lg" className="mt-4">
                  <Shield className="h-5 w-5 mr-2" />
                  Start Governance Demo
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
