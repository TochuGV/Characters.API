BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Character] (
    [ID] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [DF_Character_ID] DEFAULT newsequentialid(),
    [Image] VARCHAR(255) NOT NULL,
    [Name] VARCHAR(100) NOT NULL,
    [Age] INT,
    [Weight] FLOAT(53),
    [Story] VARCHAR(max),
    CONSTRAINT [PK_Character_ID] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[CharactersXMovies] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [CharacterID] UNIQUEIDENTIFIER NOT NULL,
    [MovieID] UNIQUEIDENTIFIER NOT NULL,
    CONSTRAINT [PK_CharactersXMovies_ID] PRIMARY KEY CLUSTERED ([ID]),
    CONSTRAINT [UQ_CharactersXMovies_CharacterID_MovieID] UNIQUE NONCLUSTERED ([CharacterID],[MovieID])
);

-- CreateTable
CREATE TABLE [dbo].[Movie] (
    [ID] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [Movie_ID_df] DEFAULT newsequentialid(),
    [Image] VARCHAR(255) NOT NULL,
    [Title] VARCHAR(100) NOT NULL,
    [CreationDate] DATE NOT NULL,
    [Rating] INT,
    CONSTRAINT [PK_Movie_ID] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[User] (
    [ID] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [User_ID_df] DEFAULT newid(),
    [Email] VARCHAR(100) NOT NULL,
    [Password] VARCHAR(100) NOT NULL,
    [Name] VARCHAR(100),
    [Role] VARCHAR(5) NOT NULL CONSTRAINT [User_Role_df] DEFAULT 'USER',
    CONSTRAINT [PK_User_ID] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[UserSession] (
    [ID] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [UserSession_ID_df] DEFAULT newid(),
    [UserID] UNIQUEIDENTIFIER NOT NULL,
    [Token] VARCHAR(max) NOT NULL,
    [Revoked] BIT NOT NULL CONSTRAINT [UserSession_Revoked_df] DEFAULT 0,
    [ExpiresAt] DATETIME2 NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [UserSession_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [PK_UserSession_ID] PRIMARY KEY CLUSTERED ([ID])
);

-- AddForeignKey
ALTER TABLE [dbo].[CharactersXMovies] ADD CONSTRAINT [FK_CharactersXMovies_CharacterID] FOREIGN KEY ([CharacterID]) REFERENCES [dbo].[Character]([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[CharactersXMovies] ADD CONSTRAINT [FK_CharactersXMovies_MovieID] FOREIGN KEY ([MovieID]) REFERENCES [dbo].[Movie]([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[UserSession] ADD CONSTRAINT [FK_UserSession_User_ID] FOREIGN KEY ([UserID]) REFERENCES [dbo].[User]([ID]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
