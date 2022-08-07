-- CreateTable
CREATE TABLE "PollQuestions" (
    "id" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endsAt" TIMESTAMP(3),
    "ownerToken" STRING NOT NULL,
    "question" STRING NOT NULL,

    CONSTRAINT "PollQuestions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Votes" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "choiceId" STRING NOT NULL,
    "ownerToken" STRING NOT NULL,
    "questionsId" STRING NOT NULL,

    CONSTRAINT "Votes_pkey" PRIMARY KEY ("questionsId","ownerToken")
);

-- CreateTable
CREATE TABLE "Options" (
    "id" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "value" STRING NOT NULL,
    "questionsId" STRING NOT NULL,

    CONSTRAINT "Options_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PollQuestions_ownerToken_idx" ON "PollQuestions"("ownerToken");

-- CreateIndex
CREATE INDEX "Votes_choiceId_idx" ON "Votes"("choiceId");

-- CreateIndex
CREATE INDEX "Votes_ownerToken_idx" ON "Votes"("ownerToken");

-- CreateIndex
CREATE INDEX "Options_questionsId_idx" ON "Options"("questionsId");
