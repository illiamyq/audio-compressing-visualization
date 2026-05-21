const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  await prisma.startup.createMany({
    data: [
      {
        name: 'Airbnb',
        idea: 'Rent out air mattresses in your apartment to strangers',
        foundedYear: 2008,
        employees: 6000,
        fundingUsd: 6000000000,
        revenueUsd: 8400000000,
        outcome: 'success',
        explanation: 'Became the world\'s largest accommodation platform, IPO\'d in 2020 at $47B valuation.'
      },
      {
        name: 'Theranos',
        idea: 'Revolutionary blood testing with just a finger prick',
        foundedYear: 2003,
        employees: 800,
        fundingUsd: 945000000,
        revenueUsd: 100000,
        outcome: 'failure',
        explanation: 'The technology never worked. Founder Elizabeth Holmes was convicted of fraud in 2022.'
      },
      {
        name: 'Quibi',
        idea: 'Short-form premium video content for mobile, 10 min episodes',
        foundedYear: 2018,
        employees: 200,
        fundingUsd: 1750000000,
        revenueUsd: 0,
        outcome: 'failure',
        explanation: 'Shut down after just 6 months. Raised $1.75B but couldn\'t find an audience.'
      },
      {
        name: 'Stripe',
        idea: 'Simple payment processing API for developers',
        foundedYear: 2010,
        employees: 8000,
        fundingUsd: 2200000000,
        revenueUsd: 14000000000,
        outcome: 'success',
        explanation: 'Became the backbone of internet payments, valued at $65B+'
      },
      {
        name: 'Jawbone',
        idea: 'Wearable fitness trackers and smart speakers',
        foundedYear: 1999,
        employees: 500,
        fundingUsd: 930000000,
        revenueUsd: 0,
        outcome: 'failure',
        explanation: 'Liquidated in 2017 despite raising nearly $1B. Lost the wearables war to Fitbit and Apple.'
      },
      {
        name: 'Notion',
        idea: 'All-in-one workspace: notes, docs, databases, wikis',
        foundedYear: 2016,
        employees: 400,
        fundingUsd: 343000000,
        revenueUsd: 250000000,
        outcome: 'success',
        explanation: 'Bootstrapped for years, then exploded during COVID. Valued at $10B.'
      },
      {
        name: 'Juicero',
        idea: 'Wi-Fi connected juice press machine for $400 + subscription bags',
        foundedYear: 2013,
        employees: 120,
        fundingUsd: 120000000,
        revenueUsd: 0,
        outcome: 'failure',
        explanation: 'Shut down after journalists revealed you could just squeeze the bags by hand.'
      },
      {
        name: 'Duolingo',
        idea: 'Free gamified language learning app',
        foundedYear: 2011,
        employees: 700,
        fundingUsd: 183000000,
        revenueUsd: 500000000,
        outcome: 'success',
        explanation: 'IPO\'d in 2021, became the world\'s most downloaded education app.'
      },
      {
        name: 'WeWork',
        idea: 'Shared office spaces with a community and lifestyle brand',
        foundedYear: 2010,
        employees: 12500,
        fundingUsd: 22000000000,
        revenueUsd: 3200000000,
        outcome: 'failure',
        explanation: 'IPO collapsed in 2019, valuation dropped from $47B to near zero. Filed for bankruptcy in 2023.'
      },
      {
        name: 'Figma',
        idea: 'Browser-based collaborative UI design tool',
        foundedYear: 2012,
        employees: 800,
        fundingUsd: 333000000,
        revenueUsd: 400000000,
        outcome: 'success',
        explanation: 'Adobe tried to acquire it for $20B in 2022. Deal was blocked but Figma remains dominant.'
      },
    ]
  })
  console.log('Seeded 10 startups!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())