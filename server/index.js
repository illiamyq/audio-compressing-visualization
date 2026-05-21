const express = require('express')
const cors = require('cors')
const { PrismaClient } = require('@prisma/client')

const app = express()
const prisma = new PrismaClient()
const PORT = 3000

app.use(cors())
app.use(express.json())

app.get('/startup/random', async (req, res) => {
  const count = await prisma.startup.count()
  const skip = Math.floor(Math.random() * count)
  const startup = await prisma.startup.findFirst({ skip })
  res.json({
    ...startup,
    fundingUsd: Number(startup.fundingUsd),
    revenueUsd: Number(startup.revenueUsd),
  })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})