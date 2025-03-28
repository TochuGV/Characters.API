USE [master]
GO
/****** Object:  Database [Characters.API]    Script Date: 20/3/2025 16:53:37 ******/
CREATE DATABASE [Characters.API]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'Characters.API', FILENAME = N'D:\Programming\Database\MSSQL16.SQLEXPRESS\MSSQL\DATA\Characters.API.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'Characters.API_log', FILENAME = N'D:\Programming\Database\MSSQL16.SQLEXPRESS\MSSQL\DATA\Characters.API_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
ALTER DATABASE [Characters.API] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [Characters.API].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [Characters.API] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [Characters.API] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [Characters.API] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [Characters.API] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [Characters.API] SET ARITHABORT OFF 
GO
ALTER DATABASE [Characters.API] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [Characters.API] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [Characters.API] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [Characters.API] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [Characters.API] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [Characters.API] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [Characters.API] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [Characters.API] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [Characters.API] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [Characters.API] SET  DISABLE_BROKER 
GO
ALTER DATABASE [Characters.API] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [Characters.API] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [Characters.API] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [Characters.API] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [Characters.API] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [Characters.API] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [Characters.API] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [Characters.API] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [Characters.API] SET  MULTI_USER 
GO
ALTER DATABASE [Characters.API] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [Characters.API] SET DB_CHAINING OFF 
GO
ALTER DATABASE [Characters.API] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [Characters.API] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [Characters.API] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [Characters.API] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [Characters.API] SET QUERY_STORE = ON
GO
ALTER DATABASE [Characters.API] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [Characters.API]
GO
/****** Object:  Table [dbo].[Character]    Script Date: 20/3/2025 16:53:37 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Character](
	[ID] [uniqueidentifier] NOT NULL,
	[Image] [varchar](255) NOT NULL,
	[Name] [varchar](100) NOT NULL,
	[Age] [int] NULL,
	[Weight] [float] NULL,
	[Story] [varchar](max) NULL,
 CONSTRAINT [PK_Character_ID] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CharactersXMovies]    Script Date: 20/3/2025 16:53:37 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CharactersXMovies](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[CharacterID] [uniqueidentifier] NOT NULL,
	[MovieID] [uniqueidentifier] NOT NULL,
 CONSTRAINT [PK_CharactersXMovies_ID] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Movie]    Script Date: 20/3/2025 16:53:37 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Movie](
	[ID] [uniqueidentifier] NOT NULL,
	[Image] [varchar](255) NOT NULL,
	[Title] [varchar](100) NOT NULL,
	[CreationDate] [date] NOT NULL,
	[Rating] [int] NULL,
 CONSTRAINT [PK_Movie_ID] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[User]    Script Date: 20/3/2025 16:53:37 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[User](
	[ID] [uniqueidentifier] NOT NULL,
	[Email] [varchar](100) NOT NULL,
	[Password] [varchar](100) NOT NULL,
 CONSTRAINT [PK_User_ID] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
INSERT [dbo].[Character] ([ID], [Image], [Name], [Age], [Weight], [Story]) VALUES (N'0f5efd93-f3ec-ef11-90ce-d45d64461b62', N'https://example.com/woody.jpg', N'Woody', 40, 1.2, N'Un vaquero y líder de los juguetes en la película Toy Story.')
INSERT [dbo].[Character] ([ID], [Image], [Name], [Age], [Weight], [Story]) VALUES (N'105efd93-f3ec-ef11-90ce-d45d64461b62', N'https://example.com/buzz.jpg', N'Buzz Lightyear', 35, 1, N'Un astronauta de juguete que viaja al espacio.')
INSERT [dbo].[Character] ([ID], [Image], [Name], [Age], [Weight], [Story]) VALUES (N'115efd93-f3ec-ef11-90ce-d45d64461b62', N'https://example.com/elsa.jpg', N'Elsa', 21, 0.8, N'La Reina de Arendelle, con poderes mágicos de hielo.')
INSERT [dbo].[Character] ([ID], [Image], [Name], [Age], [Weight], [Story]) VALUES (N'125efd93-f3ec-ef11-90ce-d45d64461b62', N'https://example.com/anna.jpg', N'Anna', 18, 0.7, N'Hermana de Elsa, valiente y decidida.')
INSERT [dbo].[Character] ([ID], [Image], [Name], [Age], [Weight], [Story]) VALUES (N'135efd93-f3ec-ef11-90ce-d45d64461b62', N'https://example.com/luke.jpg', N'Lightning McQueen', 5, 0.6, N'Un auto de carreras que busca la fama en Cars.')
INSERT [dbo].[Character] ([ID], [Image], [Name], [Age], [Weight], [Story]) VALUES (N'145efd93-f3ec-ef11-90ce-d45d64461b62', N'https://example.com/mater.jpg', N'Mater', 15, 0.8, N'El amigo fiel de Lightning McQueen, un camión de remolque.')
INSERT [dbo].[Character] ([ID], [Image], [Name], [Age], [Weight], [Story]) VALUES (N'155efd93-f3ec-ef11-90ce-d45d64461b62', N'https://example.com/joy.jpg', N'Joy', 10, 0.3, N'Una de las emociones que vive en la mente de Riley en Inside Out.')
INSERT [dbo].[Character] ([ID], [Image], [Name], [Age], [Weight], [Story]) VALUES (N'165efd93-f3ec-ef11-90ce-d45d64461b62', N'https://example.com/sadness.jpg', N'Sadness', 12, 0.4, N'Otra de las emociones de Riley, que siempre tiene una perspectiva triste.')
INSERT [dbo].[Character] ([ID], [Image], [Name], [Age], [Weight], [Story]) VALUES (N'd860cbed-32f2-ef11-90ce-d45d64461b62', N'https://example.com/remy.jpg', N'Remy', 2, 0.5, N'Una rata con un talento increíble para la cocina en Ratatouille.')
INSERT [dbo].[Character] ([ID], [Image], [Name], [Age], [Weight], [Story]) VALUES (N'd960cbed-32f2-ef11-90ce-d45d64461b62', N'https://example.com/merida.jpg', N'Merida', 16, 0.7, N'Una princesa valiente que desafía las tradiciones en Valiente.')
INSERT [dbo].[Character] ([ID], [Image], [Name], [Age], [Weight], [Story]) VALUES (N'da60cbed-32f2-ef11-90ce-d45d64461b62', N'https://example.com/walle.jpg', N'WALL-E', 700, 0.9, N'Un robot recolector de basura que descubre el amor en WALL-E.')
INSERT [dbo].[Character] ([ID], [Image], [Name], [Age], [Weight], [Story]) VALUES (N'db60cbed-32f2-ef11-90ce-d45d64461b62', N'https://example.com/arlo.jpg', N'Arlo', 12, 5.5, N'Un joven dinosaurio que busca su camino en Un Gran Dinosaurio.')
INSERT [dbo].[Character] ([ID], [Image], [Name], [Age], [Weight], [Story]) VALUES (N'dc60cbed-32f2-ef11-90ce-d45d64461b62', N'https://example.com/ian.jpg', N'Ian Lightfoot', 16, 0.8, N'Un elfo adolescente en busca de magia en Unidos.')
INSERT [dbo].[Character] ([ID], [Image], [Name], [Age], [Weight], [Story]) VALUES (N'dd60cbed-32f2-ef11-90ce-d45d64461b62', N'https://example.com/barley.jpg', N'Barley Lightfoot', 19, 1, N'El hermano mayor de Ian en Unidos.')
INSERT [dbo].[Character] ([ID], [Image], [Name], [Age], [Weight], [Story]) VALUES (N'de60cbed-32f2-ef11-90ce-d45d64461b62', N'https://example.com/duke.jpg', N'Duke Caboom', 35, 0.9, N'Un motociclista de acrobacias en Toy Story 4.')
INSERT [dbo].[Character] ([ID], [Image], [Name], [Age], [Weight], [Story]) VALUES (N'df60cbed-32f2-ef11-90ce-d45d64461b62', N'https://example.com/luca.jpg', N'Luca Paguro', 13, 0.6, N'Un joven monstruo marino que sueña con explorar la superficie.')
INSERT [dbo].[Character] ([ID], [Image], [Name], [Age], [Weight], [Story]) VALUES (N'e060cbed-32f2-ef11-90ce-d45d64461b62', N'https://example.com/alberto.jpg', N'Alberto Scorfano', 14, 0.7, N'El mejor amigo de Luca, siempre en busca de aventuras.')
INSERT [dbo].[Character] ([ID], [Image], [Name], [Age], [Weight], [Story]) VALUES (N'e160cbed-32f2-ef11-90ce-d45d64461b62', N'https://example.com/joe.jpg', N'Joe Gardner', 45, 1.2, N'Un apasionado del jazz que busca su propósito en Soul.')
INSERT [dbo].[Character] ([ID], [Image], [Name], [Age], [Weight], [Story]) VALUES (N'e260cbed-32f2-ef11-90ce-d45d64461b62', N'https://example.com/22.jpg', N'22', 0, 0.4, N'Un alma cínica que no quiere ir a la Tierra en Soul.')
INSERT [dbo].[Character] ([ID], [Image], [Name], [Age], [Weight], [Story]) VALUES (N'e360cbed-32f2-ef11-90ce-d45d64461b62', N'https://example.com/miguel.jpg', N'Miguel Rivera', 12, 0.5, N'Un niño que ama la música y viaja al mundo de los muertos en Coco.')
INSERT [dbo].[Character] ([ID], [Image], [Name], [Age], [Weight], [Story]) VALUES (N'e460cbed-32f2-ef11-90ce-d45d64461b62', N'https://example.com/ernesto.jpg', N'Ernesto de la Cruz', 50, 1, N'El famoso músico de Coco, aunque oculta un gran secreto.')
INSERT [dbo].[Character] ([ID], [Image], [Name], [Age], [Weight], [Story]) VALUES (N'e560cbed-32f2-ef11-90ce-d45d64461b62', N'https://example.com/hector.jpg', N'Héctor Rivera', 40, 0.9, N'Un esqueleto que ayuda a Miguel en su viaje en Coco.')
INSERT [dbo].[Character] ([ID], [Image], [Name], [Age], [Weight], [Story]) VALUES (N'e660cbed-32f2-ef11-90ce-d45d64461b62', N'https://example.com/cruz.jpg', N'Cruz Ramirez', 25, 1.2, N'Una talentosa entrenadora de carreras en Cars 3.')
INSERT [dbo].[Character] ([ID], [Image], [Name], [Age], [Weight], [Story]) VALUES (N'e760cbed-32f2-ef11-90ce-d45d64461b62', N'https://example.com/jackson.jpg', N'Jackson Storm', 30, 1.3, N'El rival de Rayo McQueen en Cars 3.')
INSERT [dbo].[Character] ([ID], [Image], [Name], [Age], [Weight], [Story]) VALUES (N'e860cbed-32f2-ef11-90ce-d45d64461b62', N'https://example.com/dory.jpg', N'Dory', 8, 0.6, N'Una pez cirujano azul con problemas de memoria en Buscando a Dory.')
INSERT [dbo].[Character] ([ID], [Image], [Name], [Age], [Weight], [Story]) VALUES (N'e960cbed-32f2-ef11-90ce-d45d64461b62', N'https://example.com/marlin.jpg', N'Marlin', 10, 0.7, N'El padre sobreprotector de Nemo en Buscando a Nemo.')
INSERT [dbo].[Character] ([ID], [Image], [Name], [Age], [Weight], [Story]) VALUES (N'ea60cbed-32f2-ef11-90ce-d45d64461b62', N'https://example.com/nemo.jpg', N'Nemo', 5, 0.4, N'Un pez payaso que vive una gran aventura en el océano.')
INSERT [dbo].[Character] ([ID], [Image], [Name], [Age], [Weight], [Story]) VALUES (N'eb60cbed-32f2-ef11-90ce-d45d64461b62', N'https://example.com/joy.jpg', N'Joy', 10, 0.3, N'La emoción principal de Riley en Intensamente.')
INSERT [dbo].[Character] ([ID], [Image], [Name], [Age], [Weight], [Story]) VALUES (N'ec60cbed-32f2-ef11-90ce-d45d64461b62', N'https://example.com/disgust.jpg', N'Disgust', 10, 0.3, N'La emoción del asco en Intensamente.')
INSERT [dbo].[Character] ([ID], [Image], [Name], [Age], [Weight], [Story]) VALUES (N'ed60cbed-32f2-ef11-90ce-d45d64461b62', N'https://example.com/anger.jpg', N'Anger', 10, 0.5, N'La emoción de la ira en Intensamente.')
INSERT [dbo].[Character] ([ID], [Image], [Name], [Age], [Weight], [Story]) VALUES (N'ee60cbed-32f2-ef11-90ce-d45d64461b62', N'https://example.com/ting.jpg', N'Ting Ting', 18, 0.5, N'Princesa china en Mulan 2.')
INSERT [dbo].[Character] ([ID], [Image], [Name], [Age], [Weight], [Story]) VALUES (N'ef60cbed-32f2-ef11-90ce-d45d64461b62', N'https://example.com/mei.jpg', N'Mei Lee', 13, 0.8, N'Una niña que se transforma en panda rojo en Red.')
INSERT [dbo].[Character] ([ID], [Image], [Name], [Age], [Weight], [Story]) VALUES (N'f060cbed-32f2-ef11-90ce-d45d64461b62', N'https://example.com/abby.jpg', N'Abby Park', 13, 0.7, N'La mejor amiga de Mei en Red.')
GO
SET IDENTITY_INSERT [dbo].[CharactersXMovies] ON 

INSERT [dbo].[CharactersXMovies] ([ID], [CharacterID], [MovieID]) VALUES (1, N'0f5efd93-f3ec-ef11-90ce-d45d64461b62', N'175efd93-f3ec-ef11-90ce-d45d64461b62')
INSERT [dbo].[CharactersXMovies] ([ID], [CharacterID], [MovieID]) VALUES (3, N'0f5efd93-f3ec-ef11-90ce-d45d64461b62', N'185efd93-f3ec-ef11-90ce-d45d64461b62')
INSERT [dbo].[CharactersXMovies] ([ID], [CharacterID], [MovieID]) VALUES (2, N'105efd93-f3ec-ef11-90ce-d45d64461b62', N'175efd93-f3ec-ef11-90ce-d45d64461b62')
INSERT [dbo].[CharactersXMovies] ([ID], [CharacterID], [MovieID]) VALUES (4, N'105efd93-f3ec-ef11-90ce-d45d64461b62', N'185efd93-f3ec-ef11-90ce-d45d64461b62')
INSERT [dbo].[CharactersXMovies] ([ID], [CharacterID], [MovieID]) VALUES (5, N'115efd93-f3ec-ef11-90ce-d45d64461b62', N'195efd93-f3ec-ef11-90ce-d45d64461b62')
INSERT [dbo].[CharactersXMovies] ([ID], [CharacterID], [MovieID]) VALUES (13, N'115efd93-f3ec-ef11-90ce-d45d64461b62', N'1d5efd93-f3ec-ef11-90ce-d45d64461b62')
INSERT [dbo].[CharactersXMovies] ([ID], [CharacterID], [MovieID]) VALUES (6, N'125efd93-f3ec-ef11-90ce-d45d64461b62', N'195efd93-f3ec-ef11-90ce-d45d64461b62')
INSERT [dbo].[CharactersXMovies] ([ID], [CharacterID], [MovieID]) VALUES (14, N'125efd93-f3ec-ef11-90ce-d45d64461b62', N'1d5efd93-f3ec-ef11-90ce-d45d64461b62')
INSERT [dbo].[CharactersXMovies] ([ID], [CharacterID], [MovieID]) VALUES (7, N'135efd93-f3ec-ef11-90ce-d45d64461b62', N'1a5efd93-f3ec-ef11-90ce-d45d64461b62')
INSERT [dbo].[CharactersXMovies] ([ID], [CharacterID], [MovieID]) VALUES (9, N'135efd93-f3ec-ef11-90ce-d45d64461b62', N'1b5efd93-f3ec-ef11-90ce-d45d64461b62')
INSERT [dbo].[CharactersXMovies] ([ID], [CharacterID], [MovieID]) VALUES (8, N'145efd93-f3ec-ef11-90ce-d45d64461b62', N'1a5efd93-f3ec-ef11-90ce-d45d64461b62')
INSERT [dbo].[CharactersXMovies] ([ID], [CharacterID], [MovieID]) VALUES (10, N'145efd93-f3ec-ef11-90ce-d45d64461b62', N'1b5efd93-f3ec-ef11-90ce-d45d64461b62')
INSERT [dbo].[CharactersXMovies] ([ID], [CharacterID], [MovieID]) VALUES (11, N'155efd93-f3ec-ef11-90ce-d45d64461b62', N'1c5efd93-f3ec-ef11-90ce-d45d64461b62')
INSERT [dbo].[CharactersXMovies] ([ID], [CharacterID], [MovieID]) VALUES (15, N'155efd93-f3ec-ef11-90ce-d45d64461b62', N'1e5efd93-f3ec-ef11-90ce-d45d64461b62')
INSERT [dbo].[CharactersXMovies] ([ID], [CharacterID], [MovieID]) VALUES (12, N'165efd93-f3ec-ef11-90ce-d45d64461b62', N'1c5efd93-f3ec-ef11-90ce-d45d64461b62')
INSERT [dbo].[CharactersXMovies] ([ID], [CharacterID], [MovieID]) VALUES (16, N'd860cbed-32f2-ef11-90ce-d45d64461b62', N'1ac7131a-33f2-ef11-90ce-d45d64461b62')
INSERT [dbo].[CharactersXMovies] ([ID], [CharacterID], [MovieID]) VALUES (17, N'd960cbed-32f2-ef11-90ce-d45d64461b62', N'1bc7131a-33f2-ef11-90ce-d45d64461b62')
INSERT [dbo].[CharactersXMovies] ([ID], [CharacterID], [MovieID]) VALUES (18, N'da60cbed-32f2-ef11-90ce-d45d64461b62', N'1cc7131a-33f2-ef11-90ce-d45d64461b62')
INSERT [dbo].[CharactersXMovies] ([ID], [CharacterID], [MovieID]) VALUES (19, N'db60cbed-32f2-ef11-90ce-d45d64461b62', N'1dc7131a-33f2-ef11-90ce-d45d64461b62')
INSERT [dbo].[CharactersXMovies] ([ID], [CharacterID], [MovieID]) VALUES (20, N'dc60cbed-32f2-ef11-90ce-d45d64461b62', N'1ec7131a-33f2-ef11-90ce-d45d64461b62')
INSERT [dbo].[CharactersXMovies] ([ID], [CharacterID], [MovieID]) VALUES (21, N'de60cbed-32f2-ef11-90ce-d45d64461b62', N'1fc7131a-33f2-ef11-90ce-d45d64461b62')
INSERT [dbo].[CharactersXMovies] ([ID], [CharacterID], [MovieID]) VALUES (22, N'df60cbed-32f2-ef11-90ce-d45d64461b62', N'20c7131a-33f2-ef11-90ce-d45d64461b62')
INSERT [dbo].[CharactersXMovies] ([ID], [CharacterID], [MovieID]) VALUES (23, N'e160cbed-32f2-ef11-90ce-d45d64461b62', N'21c7131a-33f2-ef11-90ce-d45d64461b62')
INSERT [dbo].[CharactersXMovies] ([ID], [CharacterID], [MovieID]) VALUES (28, N'e560cbed-32f2-ef11-90ce-d45d64461b62', N'1e5efd93-f3ec-ef11-90ce-d45d64461b62')
INSERT [dbo].[CharactersXMovies] ([ID], [CharacterID], [MovieID]) VALUES (24, N'e660cbed-32f2-ef11-90ce-d45d64461b62', N'22c7131a-33f2-ef11-90ce-d45d64461b62')
INSERT [dbo].[CharactersXMovies] ([ID], [CharacterID], [MovieID]) VALUES (25, N'e860cbed-32f2-ef11-90ce-d45d64461b62', N'23c7131a-33f2-ef11-90ce-d45d64461b62')
INSERT [dbo].[CharactersXMovies] ([ID], [CharacterID], [MovieID]) VALUES (26, N'ea60cbed-32f2-ef11-90ce-d45d64461b62', N'24c7131a-33f2-ef11-90ce-d45d64461b62')
INSERT [dbo].[CharactersXMovies] ([ID], [CharacterID], [MovieID]) VALUES (27, N'ef60cbed-32f2-ef11-90ce-d45d64461b62', N'27c7131a-33f2-ef11-90ce-d45d64461b62')
SET IDENTITY_INSERT [dbo].[CharactersXMovies] OFF
GO
INSERT [dbo].[Movie] ([ID], [Image], [Title], [CreationDate], [Rating]) VALUES (N'175efd93-f3ec-ef11-90ce-d45d64461b62', N'https://example.com/toystory.jpg', N'Toy Story', CAST(N'1995-11-22' AS Date), 5)
INSERT [dbo].[Movie] ([ID], [Image], [Title], [CreationDate], [Rating]) VALUES (N'185efd93-f3ec-ef11-90ce-d45d64461b62', N'https://example.com/toystory2.jpg', N'Toy Story 2', CAST(N'1999-11-24' AS Date), 5)
INSERT [dbo].[Movie] ([ID], [Image], [Title], [CreationDate], [Rating]) VALUES (N'195efd93-f3ec-ef11-90ce-d45d64461b62', N'https://example.com/frozen.jpg', N'Frozen', CAST(N'2013-11-27' AS Date), 5)
INSERT [dbo].[Movie] ([ID], [Image], [Title], [CreationDate], [Rating]) VALUES (N'1a5efd93-f3ec-ef11-90ce-d45d64461b62', N'https://example.com/cars.jpg', N'Cars', CAST(N'2006-06-09' AS Date), 4)
INSERT [dbo].[Movie] ([ID], [Image], [Title], [CreationDate], [Rating]) VALUES (N'1b5efd93-f3ec-ef11-90ce-d45d64461b62', N'https://example.com/cars2.jpg', N'Cars 2', CAST(N'2011-06-24' AS Date), 3)
INSERT [dbo].[Movie] ([ID], [Image], [Title], [CreationDate], [Rating]) VALUES (N'1c5efd93-f3ec-ef11-90ce-d45d64461b62', N'https://example.com/insideout.jpg', N'Inside Out', CAST(N'2015-06-19' AS Date), 5)
INSERT [dbo].[Movie] ([ID], [Image], [Title], [CreationDate], [Rating]) VALUES (N'1d5efd93-f3ec-ef11-90ce-d45d64461b62', N'https://example.com/frozen2.jpg', N'Frozen 2', CAST(N'2019-11-22' AS Date), 4)
INSERT [dbo].[Movie] ([ID], [Image], [Title], [CreationDate], [Rating]) VALUES (N'1e5efd93-f3ec-ef11-90ce-d45d64461b62', N'https://example.com/coco.jpg', N'Coco', CAST(N'2017-11-22' AS Date), 5)
INSERT [dbo].[Movie] ([ID], [Image], [Title], [CreationDate], [Rating]) VALUES (N'1ac7131a-33f2-ef11-90ce-d45d64461b62', N'https://example.com/ratatouille.jpg', N'Ratatouille', CAST(N'2007-06-29' AS Date), 5)
INSERT [dbo].[Movie] ([ID], [Image], [Title], [CreationDate], [Rating]) VALUES (N'1bc7131a-33f2-ef11-90ce-d45d64461b62', N'https://example.com/brave.jpg', N'Valiente', CAST(N'2012-06-22' AS Date), 4)
INSERT [dbo].[Movie] ([ID], [Image], [Title], [CreationDate], [Rating]) VALUES (N'1cc7131a-33f2-ef11-90ce-d45d64461b62', N'https://example.com/walle.jpg', N'WALL-E', CAST(N'2008-06-27' AS Date), 5)
INSERT [dbo].[Movie] ([ID], [Image], [Title], [CreationDate], [Rating]) VALUES (N'1dc7131a-33f2-ef11-90ce-d45d64461b62', N'https://example.com/gooddinosaur.jpg', N'Un Gran Dinosaurio', CAST(N'2015-11-25' AS Date), 4)
INSERT [dbo].[Movie] ([ID], [Image], [Title], [CreationDate], [Rating]) VALUES (N'1ec7131a-33f2-ef11-90ce-d45d64461b62', N'https://example.com/onward.jpg', N'Unidos', CAST(N'2020-03-06' AS Date), 4)
INSERT [dbo].[Movie] ([ID], [Image], [Title], [CreationDate], [Rating]) VALUES (N'1fc7131a-33f2-ef11-90ce-d45d64461b62', N'https://example.com/toystory4.jpg', N'Toy Story 4', CAST(N'2019-06-21' AS Date), 5)
INSERT [dbo].[Movie] ([ID], [Image], [Title], [CreationDate], [Rating]) VALUES (N'20c7131a-33f2-ef11-90ce-d45d64461b62', N'https://example.com/luca.jpg', N'Luca', CAST(N'2021-06-18' AS Date), 4)
INSERT [dbo].[Movie] ([ID], [Image], [Title], [CreationDate], [Rating]) VALUES (N'21c7131a-33f2-ef11-90ce-d45d64461b62', N'https://example.com/soul.jpg', N'Soul', CAST(N'2020-12-25' AS Date), 5)
INSERT [dbo].[Movie] ([ID], [Image], [Title], [CreationDate], [Rating]) VALUES (N'22c7131a-33f2-ef11-90ce-d45d64461b62', N'https://example.com/cars3.jpg', N'Cars 3', CAST(N'2017-06-16' AS Date), 4)
INSERT [dbo].[Movie] ([ID], [Image], [Title], [CreationDate], [Rating]) VALUES (N'23c7131a-33f2-ef11-90ce-d45d64461b62', N'https://example.com/findingdory.jpg', N'Buscando a Dory', CAST(N'2016-06-17' AS Date), 4)
INSERT [dbo].[Movie] ([ID], [Image], [Title], [CreationDate], [Rating]) VALUES (N'24c7131a-33f2-ef11-90ce-d45d64461b62', N'https://example.com/findingnemo.jpg', N'Buscando a Nemo', CAST(N'2003-05-30' AS Date), 5)
INSERT [dbo].[Movie] ([ID], [Image], [Title], [CreationDate], [Rating]) VALUES (N'25c7131a-33f2-ef11-90ce-d45d64461b62', N'https://example.com/insideout.jpg', N'Intensamente', CAST(N'2015-06-19' AS Date), 5)
INSERT [dbo].[Movie] ([ID], [Image], [Title], [CreationDate], [Rating]) VALUES (N'26c7131a-33f2-ef11-90ce-d45d64461b62', N'https://example.com/mulan2.jpg', N'Mulan 2', CAST(N'2004-11-03' AS Date), 3)
INSERT [dbo].[Movie] ([ID], [Image], [Title], [CreationDate], [Rating]) VALUES (N'27c7131a-33f2-ef11-90ce-d45d64461b62', N'https://example.com/red.jpg', N'Red', CAST(N'2022-03-11' AS Date), 4)
GO
INSERT [dbo].[User] ([ID], [Email], [Password]) VALUES (N'fd331311-9db2-4f13-981a-3c154851baad', N'user.example@gmail.com', N'$2b$10$9KRmDkCU1POJlrU8ocaHRuMpCbXBTZeDzZx4xft75D9.mWtxKfcA.')
GO
/****** Object:  Index [UQ_CharactersXMovies_CharacterID_MovieID]    Script Date: 20/3/2025 16:53:37 ******/
ALTER TABLE [dbo].[CharactersXMovies] ADD  CONSTRAINT [UQ_CharactersXMovies_CharacterID_MovieID] UNIQUE NONCLUSTERED 
(
	[CharacterID] ASC,
	[MovieID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Character] ADD  CONSTRAINT [DF_Character_ID]  DEFAULT (newsequentialid()) FOR [ID]
GO
ALTER TABLE [dbo].[Movie] ADD  CONSTRAINT [DF_Movie_ID]  DEFAULT (newsequentialid()) FOR [ID]
GO
ALTER TABLE [dbo].[User] ADD  CONSTRAINT [DF_User_ID]  DEFAULT (newid()) FOR [ID]
GO
ALTER TABLE [dbo].[CharactersXMovies]  WITH CHECK ADD  CONSTRAINT [FK_CharactersXMovies_CharacterID] FOREIGN KEY([CharacterID])
REFERENCES [dbo].[Character] ([ID])
GO
ALTER TABLE [dbo].[CharactersXMovies] CHECK CONSTRAINT [FK_CharactersXMovies_CharacterID]
GO
ALTER TABLE [dbo].[CharactersXMovies]  WITH CHECK ADD  CONSTRAINT [FK_CharactersXMovies_MovieID] FOREIGN KEY([MovieID])
REFERENCES [dbo].[Movie] ([ID])
GO
ALTER TABLE [dbo].[CharactersXMovies] CHECK CONSTRAINT [FK_CharactersXMovies_MovieID]
GO
ALTER TABLE [dbo].[Character]  WITH CHECK ADD  CONSTRAINT [CK_Character_Age] CHECK  (([Age]>=(0)))
GO
ALTER TABLE [dbo].[Character] CHECK CONSTRAINT [CK_Character_Age]
GO
ALTER TABLE [dbo].[Character]  WITH CHECK ADD  CONSTRAINT [CK_Character_Weight] CHECK  (([Weight]>(0)))
GO
ALTER TABLE [dbo].[Character] CHECK CONSTRAINT [CK_Character_Weight]
GO
ALTER TABLE [dbo].[Movie]  WITH CHECK ADD  CONSTRAINT [CK_Movie_Rating] CHECK  (([Rating]>=(1) AND [Rating]<=(5)))
GO
ALTER TABLE [dbo].[Movie] CHECK CONSTRAINT [CK_Movie_Rating]
GO
ALTER TABLE [dbo].[User]  WITH CHECK ADD  CONSTRAINT [CK_User_Email] CHECK  (([Email] like '%@%'))
GO
ALTER TABLE [dbo].[User] CHECK CONSTRAINT [CK_User_Email]
GO
ALTER TABLE [dbo].[User]  WITH CHECK ADD  CONSTRAINT [CK_User_Password] CHECK  ((len([Password])>=(6)))
GO
ALTER TABLE [dbo].[User] CHECK CONSTRAINT [CK_User_Password]
GO
/****** Object:  StoredProcedure [dbo].[CreateCharacter]    Script Date: 20/3/2025 16:53:37 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[CreateCharacter]
	@pImage VARCHAR(255), 
	@pName VARCHAR(100), 
	@pAge INT = NULL, 
	@pWeight FLOAT = NULL, 
	@pStory VARCHAR(MAX) = NULL
AS
BEGIN
	SET NOCOUNT ON;

	IF @pImage IS NULL OR LTRIM(RTRIM(@pImage)) = ''
    BEGIN
        RAISERROR ('Image cannot be NULL or empty.', 16, 1);
        RETURN;
    END;

	IF @pName IS NULL OR LTRIM(RTRIM(@pName)) = ''
    BEGIN
        RAISERROR ('Name cannot be NULL or empty.', 16, 1);
        RETURN;
    END;

    IF @pAge < 0
    BEGIN
        RAISERROR('Age cannot be less than 0.', 16, 1);
        RETURN;
    END

    IF @pWeight <= 0
    BEGIN
        RAISERROR('Weight must be more than 0.', 16, 1);
        RETURN;
    END

	INSERT INTO Character(Image, Name, Age, Weight, Story) VALUES (@pImage, @pName, @pAge, @pWeight, @pStory);

	SELECT @@ROWCOUNT AS RowsAffected;
END;
GO
/****** Object:  StoredProcedure [dbo].[CreateMovie]    Script Date: 20/3/2025 16:53:37 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[CreateMovie]
	@pImage VARCHAR(255), 
	@pTitle VARCHAR(100), 
	@pCreationDate DATE, 
	@pRating INT = NULL 
AS
BEGIN
	SET NOCOUNT ON;

	    IF @pImage IS NULL OR LTRIM(RTRIM(@pImage)) = ''
    BEGIN
        RAISERROR ('Image cannot be NULL or empty.', 16, 1);
        RETURN;
    END;

    IF @pTitle IS NULL OR LTRIM(RTRIM(@pTitle)) = ''
    BEGIN
        RAISERROR ('Title cannot be NULL or empty.', 16, 1);
        RETURN;
    END;

    IF @pCreationDate IS NULL
    BEGIN
        RAISERROR ('CreationDate cannot be NULL.', 16, 1);
        RETURN;
    END;

    IF (@pRating < 1 OR @pRating > 5)
    BEGIN
        RAISERROR ('Rating must be between 1 and 5.', 16, 1);
        RETURN;
    END;

	INSERT INTO Movie(Image, Title, CreationDate, Rating) VALUES (@pImage, @pTitle, @pCreationDate, @pRating);

	SELECT @@ROWCOUNT AS RowsAffected;
END;
GO
/****** Object:  StoredProcedure [dbo].[CreateUser]    Script Date: 20/3/2025 16:53:37 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[CreateUser]
    @pEmail VARCHAR(100),
    @pPassword VARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO [User] (Email, Password)
    VALUES (@pEmail, @pPassword);

	SELECT @@ROWCOUNT AS RowsAffected;
END;
GO
/****** Object:  StoredProcedure [dbo].[DeleteCharacterById]    Script Date: 20/3/2025 16:53:37 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[DeleteCharacterById]
	@pID UNIQUEIDENTIFIER
AS
BEGIN
	SET NOCOUNT ON;

	DELETE FROM Character WHERE ID = @pID

	SELECT @@ROWCOUNT AS RowsAffected;
END;
GO
/****** Object:  StoredProcedure [dbo].[DeleteMovieById]    Script Date: 20/3/2025 16:53:37 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[DeleteMovieById]
	@pID UNIQUEIDENTIFIER
AS
BEGIN
	SET NOCOUNT ON;

	DELETE FROM Movie WHERE ID = @pID

	SELECT @@ROWCOUNT AS RowsAffected;
END;
GO
/****** Object:  StoredProcedure [dbo].[GetCharacterById]    Script Date: 20/3/2025 16:53:37 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[GetCharacterById]
	@pID UNIQUEIDENTIFIER
AS
BEGIN
	SET NOCOUNT ON;

	SELECT * FROM Character LEFT JOIN CharactersXMovies ON Character.ID = CharactersXMovies.CharacterID
    LEFT JOIN Movie ON Movie.ID = CharactersXMovies.MovieID WHERE Character.ID = @pID

END;
GO
/****** Object:  StoredProcedure [dbo].[GetCharacters]    Script Date: 20/3/2025 16:53:37 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[GetCharacters]
	@pName VARCHAR(100) = NULL,
	@pAge INT = NULL,
	@pWeight FLOAT = NULL,
	@pMovieID UNIQUEIDENTIFIER = NULL,
	@pOffset INT,
	@pLimit INT
AS
BEGIN
	SET NOCOUNT ON;
	
	SELECT c.ID, c.Image, c.Name FROM Character c WHERE
		(@pName IS NULL OR c.Name LIKE '%' + @pName + '%') AND
		(@pAge IS NULL OR c.Age = @pAge) AND
        (@pWeight IS NULL OR c.Weight = @pWeight) AND
        (@pMovieID IS NULL OR EXISTS 
			(SELECT 1 FROM CharactersXMovies cxm WHERE cxm.CharacterID = c.ID AND cxm.MovieID = @pMovieID))
        ORDER BY c.ID OFFSET @pOffset ROWS FETCH NEXT @pLimit ROWS ONLY;
END;

GO
/****** Object:  StoredProcedure [dbo].[GetCharactersCount]    Script Date: 20/3/2025 16:53:37 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[GetCharactersCount]
	@pName VARCHAR(100) = NULL,
	@pAge INT = NULL,
	@pWeight FLOAT = NULL,
	@pMovieID UNIQUEIDENTIFIER = NULL
AS
BEGIN
	SET NOCOUNT ON;

	SELECT COUNT(DISTINCT c.ID) AS Total FROM Character c
	LEFT JOIN CharactersXMovies cxm ON c.ID = cxm.CharacterID WHERE
		(@pName IS NULL OR c.Name LIKE '%' + @pName + '%') AND
		(@pAge IS NULL OR c.Age = @pAge) AND
		(@pWeight IS NULL OR c.Weight = @pWeight) AND
        (@pMovieID IS NULL OR cxm.MovieID = @pMovieID);
END;

GO
/****** Object:  StoredProcedure [dbo].[GetMovieById]    Script Date: 20/3/2025 16:53:37 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[GetMovieById]
	@pID UNIQUEIDENTIFIER
AS
BEGIN
	SET NOCOUNT ON;

	SELECT * FROM Movie LEFT JOIN CharactersXMovies ON Movie.ID = CharactersXMovies.MovieID 
    LEFT JOIN Character ON Character.ID = CharactersXMovies.CharacterID WHERE Movie.ID = @pID

END;
GO
/****** Object:  StoredProcedure [dbo].[GetMovies]    Script Date: 20/3/2025 16:53:37 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[GetMovies]
	@pTitle VARCHAR(100) = NULL,
	@pOrder VARCHAR(4) = NULL,
	@pOffset INT = 0,
	@pLimit INT = 10
AS
BEGIN
	SET NOCOUNT ON;

	SET @pOrder = COALESCE(@pOrder, 'ASC');

	IF @pOrder NOT IN ('ASC', 'DESC')
	BEGIN
		RAISERROR ('Order must be ASC or DESC', 16, 1);
		RETURN;
	END;

		DECLARE @sql NVARCHAR(MAX) = N'
	SELECT ID, Image, Title, CreationDate' + 
		CASE WHEN @pTitle IS NOT NULL THEN ', Rating' ELSE '' END + '
	FROM Movie
	WHERE (@pTitle IS NULL OR Title LIKE ''%'' + @pTitle + ''%'')
	ORDER BY CreationDate ' + @pOrder + '
	OFFSET @pOffset ROWS FETCH NEXT @pLimit ROWS ONLY;';

	EXEC sp_executesql @sql, 
		N'@pTitle VARCHAR(100), @pOffset INT, @pLimit INT', 
		@pTitle, @pOffset, @pLimit;
END;
GO
/****** Object:  StoredProcedure [dbo].[GetMoviesCount]    Script Date: 20/3/2025 16:53:37 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[GetMoviesCount]
	@pTitle VARCHAR(100) = NULL
AS
BEGIN
	SET NOCOUNT ON;

	SELECT COUNT(*) AS Total FROM Movie WHERE (@pTitle IS NULL OR Title LIKE '%' + @pTitle + '%');
END;

GO
/****** Object:  StoredProcedure [dbo].[GetUserByEmail]    Script Date: 20/3/2025 16:53:37 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[GetUserByEmail]
    @pEmail VARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT * FROM [User] WHERE Email = @pEmail

END;
GO
/****** Object:  StoredProcedure [dbo].[UpdateCharacterById]    Script Date: 20/3/2025 16:53:37 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[UpdateCharacterById]
	@pID UNIQUEIDENTIFIER,
	@pImage VARCHAR(255), 
	@pName VARCHAR(100), 
	@pAge INT = NULL, 
	@pWeight FLOAT = NULL, 
	@pStory VARCHAR(MAX) = NULL
AS
BEGIN
	SET NOCOUNT ON;

	IF @pImage IS NULL OR LTRIM(RTRIM(@pImage)) = ''
    BEGIN
        RAISERROR ('Image cannot be NULL or empty.', 16, 1);
        RETURN;
    END;

	IF @pName IS NULL OR LTRIM(RTRIM(@pName)) = ''
    BEGIN
        RAISERROR ('Name cannot be NULL or empty.', 16, 1);
        RETURN;
    END;

    IF @pAge < 0
    BEGIN
        RAISERROR('Age cannot be less than 0.', 16, 1);
        RETURN;
    END

    IF @pWeight <= 0
    BEGIN
        RAISERROR('Weight must be more than 0.', 16, 1);
        RETURN;
    END

	UPDATE Character SET Image = @pImage, Name = @pName, Age = @pAge, Weight = @pWeight, Story = @pStory WHERE ID = @pID

	SELECT @@ROWCOUNT AS RowsAffected;
END;
GO
/****** Object:  StoredProcedure [dbo].[UpdateMovieById]    Script Date: 20/3/2025 16:53:37 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[UpdateMovieById]
	@pID UNIQUEIDENTIFIER,
	@pImage VARCHAR(255), 
	@pTitle VARCHAR(100), 
	@pCreationDate DATE, 
	@pRating INT = NULL 
AS
BEGIN
	SET NOCOUNT ON;

	IF @pImage IS NULL OR LTRIM(RTRIM(@pImage)) = ''
    BEGIN
        RAISERROR ('Image cannot be NULL or empty.', 16, 1);
        RETURN;
    END;

    IF @pTitle IS NULL OR LTRIM(RTRIM(@pTitle)) = ''
    BEGIN
        RAISERROR ('Title cannot be NULL or empty.', 16, 1);
        RETURN;
    END;

    IF @pCreationDate IS NULL
    BEGIN
        RAISERROR ('CreationDate cannot be NULL.', 16, 1);
        RETURN;
    END;

    IF (@pRating < 1 OR @pRating > 5)
    BEGIN
        RAISERROR ('Rating must be between 1 and 5.', 16, 1);
        RETURN;
    END;

	UPDATE Movie SET Image = @pImage, Title = @pTitle, CreationDate = @pCreationDate, Rating = @pRating WHERE ID = @pID

	SELECT @@ROWCOUNT AS RowsAffected;
END;
GO
USE [master]
GO
ALTER DATABASE [Characters.API] SET  READ_WRITE 
GO
