"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Rocket,
  Zap,
  Users,
  Code,
  Mail,
  ExternalLink,
  ChevronRight,
  Target,
  Calculator,
  Star,
  ArrowRight,
  Cpu,
  Globe,
  BookOpen,
  BadgeAlert,
} from "lucide-react";
import Link from "next/link";

const modules = [
  {
    title: "Free Project",
    icon: <Code className="h-8 w-8" />,
    credit: "1 credit = 5 days",
    description:
      "If you want to explore a technical subject or realize a project that is close to your heart this unit is for you! If your subject is validated by your pedagogical team, you can be rewarded some credits for your personal work.",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    link: "https://intra.epitech.eu/module/2024/G-INN-020/BAR-0-1/#!/all",
  },
  {
    title: "Hackathons",
    icon: <Zap className="h-8 w-8" />,
    credit: "1 credit = 2 hackathons",
    description:
      "A hackathon is an event where programmers and other tech enthusiasts collaborate intensively to create software or hardware projects within a short time frame, typically ranging from 1 to 2 days (often on the week-ends!). It's often competitive and focused on innovation and problem-solving.",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    multiplier: "Organizing counts double",
    link: "https://intra.epitech.eu/module/2024/G-INN-010/BAR-0-1/#!/all",
  },
  {
    title: "Talks & Conferences",
    icon: <Users className="h-8 w-8" />,
    credit: "1 credit = 10 hours",
    description:
      "This unit brings together all the lectures, workshops and conferences you can attend during your year. These activities are designed to help you familiarise yourself with different technical subjects and explore horizons you might not have thought of.",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    multiplier: "Organizing counts double",
    link: "https://intra.epitech.eu/module/2024/G-INN-001/BAR-0-1/#!/all",
  },
  {
    title: "User Groups",
    icon: <Target className="h-8 w-8" />,
    credit: "1 credit = 10 hours",
    description:
      "A User Group is a community of individuals who use a specific technology, software, or service, sharing knowledge, best practices, and experiences. This unit is here to organize the user groups among students and show their activities.",
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    multiplier: "Organizing counts triple",
    link: "https://intra.epitech.eu/module/2024/G-INN-030/BAR-0-1/#!/all",
  },
];

const guides = [
  {
    title: "Guide to create a Talk/Workshop",
    icon: <BookOpen className="h-5 w-5" />,
    link: "/dashboard/presentations/new",
  },
  {
    title: "Guide to create a Free Project",
    icon: <Code className="h-5 w-5" />,
    link: "/dashboard/new-project",
  },
  {
    title: "Guide to start a Hackathon",
    icon: <Star className="h-5 w-5" />,
    link: "/dashboard/presentations/new",
  },
];

const faqData = [
  {
    question: "What happened to the old Hub Module?",
    answer:
      "The Hub Module as we knew before no longer exists and is now separated into 4 specialized modules: Free Project, Hackathons, Talks and Conferences, and User Groups. Each module has its own credit system and requirements.",
  },
  {
    question: "How do credits work in the new system?",
    answer:
      "Each module has a different credit calculation: Free Projects (1 credit = 5 days), Hackathons (1 credit = 2 hackathons), Talks & Conferences (1 credit = 10 hours), and User Groups (1 credit = 10 hours). Organizing activities often provides multipliers.",
  },
  {
    question: "Can I combine hours from different modules?",
    answer:
      "No, hours cannot be accumulated across different modules. For example, if you have 2 extra hours in User Groups, you cannot combine them with Talks and Conferences. You need to complete the full requirement within each specific module.",
  },
  {
    question: "What's the difference between Talks and User Groups?",
    answer:
      "Talks and Conferences are activities that only require audience attention with no interaction (like talk lectures). User Groups are interactive activities requiring public participation and actions (like workshops).",
  },
  {
    question: "How do organizing multipliers work?",
    answer:
      "When you organize activities, you get bonus credits: Hackathons (double), Talks & Conferences (double), and User Groups (triple). For example, organizing a 2-hour workshop gives you 6 hours credit (2 hours × 3 multiplier).",
  },
  {
    question: "Who should I contact for Hub-related questions?",
    answer:
      "For any Hub-related questions or support, contact the Hub Manager at angel.halouane@epitech.eu",
  },
  {
    question: "What equipment and resources are available?",
    answer:
      "The Hub provides access to electronic and technological equipment for your projects. Check the Hub Inventory Process for detailed information about available resources and how to access them.",
  },
  {
    question: "How do I get started with a project?",
    answer:
      "Choose the appropriate module for your activity, follow the corresponding guide, and submit your proposal. Each module has specific templates and requirements outlined in the resource guides.",
  },
];

export default function WhatIsHubPage() {
  const [activeModule, setActiveModule] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-blue-200">
              <Rocket className="h-5 w-5 text-blue-600" />
              <span className="text-blue-600 font-medium">
                Welcome to the Future of Learning
              </span>
            </div>

            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              What is HUB?
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              The HUB is where we create and manage projects, talks, workshops,
              hackathons and experiences at Epitech.
              <span className="font-bold"> One advice? </span> Be as creative
              and proactive as possible, the HUB is a place for you to express
              yourself and your ideas.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-3 rounded-full border-2"
              >
                <Mail className="mr-2 h-5 w-5" />
                Contact Hub Manager
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modules Section */}
      <div className="bg-white/50 backdrop-blur-sm py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 mb-4">
              New System
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              How does it work?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The Hub module has evolved into four specialized modules, each
              designed to maximize your learning experience and credit earning
              potential.
            </p>
          </div>
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <BadgeAlert className="inline-block mr-2 h-5 w-5 text-yellow-600" />
              <strong>Tek1, Tek2, Tek3 and Tek5:</strong> You can only get 4 credits maximum per each of these modules.
              <br />
              <strong className="pl-7">Tek4:</strong> You have no limit of
              credits per module, but you can only get up to 8 credits if you
              have and internship and up to 15 if you don't.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {modules.map((module, index) => (
              <Card
                key={index}
                className={`border-2 ${module.borderColor} ${module.bgColor} hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1`}
                onClick={() => setActiveModule(index)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-16 h-16 bg-gradient-to-r ${module.color} rounded-xl flex items-center justify-center text-white`}
                      >
                        {module.icon}
                      </div>
                      <div>
                        <CardTitle className="text-xl text-gray-900">
                          {module.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Badge variant="outline" className="mt-1">
                            {module.credit}
                          </Badge>
                          {module.multiplier && (
                            <Badge className="bg-gradient-to-r from-purple-400 to-purple-600 text-white">
                              {module.multiplier}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <a
                      href={module.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </a>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-3">{module.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Example Calculation */}
          <Card className="mt-12 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-indigo-900">
                <Calculator className="h-6 w-6" />
                Example Calculation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white/80 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Organizing 2 workshops of 2 hours each:
                </h4>
                <div className="space-y-2 text-gray-700">
                  <p>• Base time: 2 workshops × 2 hours = 4 hours</p>
                  <p>• User Groups multiplier: 4 hours × 3 = 12 hours</p>
                  <p>
                    • Result:{" "}
                    <span className="font-bold text-indigo-600">
                      12 hours in User Groups module
                    </span>
                  </p>
                </div>
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> The extra 2 hours cannot be combined
                    with other modules. You need 8 more hours in User Groups to
                    complete the credit.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Resources Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Guides & Resources
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to get started with your Hub activities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {guides.map((guide, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm"
            >
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-300 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  {guide.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {guide.title}
                </h3>
                <Link href={guide.link}>
                  <Button variant="outline" size="sm" className="w-full">
                    View Guide
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Resources */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Cpu className="h-6 w-6" />
                Hub Inventory
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-700 mb-4">
                Access our comprehensive inventory of electronic and
                technological equipment.
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                View Inventory Process
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-900">
                <Globe className="h-6 w-6" />
                Templates & Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-700 mb-4">
                Download project templates and access shared resources for your
                activities.
              </p>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Access Templates
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Get answers to common questions about the Hub system
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqData.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white/80 backdrop-blur-sm rounded-lg border-0 shadow-sm"
              >
                <AccordionTrigger className="px-6 py-4 text-left font-semibold text-gray-900 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Need Help or Information?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Our Hub Manager is here to support you with any questions or
            guidance you need.
          </p>
          <a href="mailto:angel.halouane@epitech.eu">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-full"
            >
              <Mail className="mr-2 h-5 w-5" />
              Contact Hub Manager
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
