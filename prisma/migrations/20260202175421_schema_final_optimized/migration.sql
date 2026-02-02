BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[CharactersXMovies] DROP CONSTRAINT [FK_CharactersXMovies_CharacterID];

-- DropForeignKey
ALTER TABLE [dbo].[CharactersXMovies] DROP CONSTRAINT [FK_CharactersXMovies_MovieID];

-- AlterTable
ALTER TABLE [dbo].[User] DROP CONSTRAINT [DF_User_ID];
ALTER TABLE [dbo].[User] ADD CONSTRAINT [DF_User_ID] DEFAULT newsequentialid() FOR [ID];

-- AlterTable
ALTER TABLE [dbo].[UserSession] DROP CONSTRAINT [DF_UserSession_ID];
ALTER TABLE [dbo].[UserSession] ADD CONSTRAINT [DF_UserSession_ID] DEFAULT newsequentialid() FOR [ID];

-- AddForeignKey
ALTER TABLE [dbo].[CharactersXMovies] ADD CONSTRAINT [FK_CharactersXMovies_CharacterID] FOREIGN KEY ([CharacterID]) REFERENCES [dbo].[Character]([ID]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[CharactersXMovies] ADD CONSTRAINT [FK_CharactersXMovies_MovieID] FOREIGN KEY ([MovieID]) REFERENCES [dbo].[Movie]([ID]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- RenameIndex
EXEC SP_RENAME N'dbo.User.User_Email_key', N'UQ_User_Email', N'INDEX';

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
