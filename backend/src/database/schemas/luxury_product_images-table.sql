CREATE TABLE [dbo].[luxury_product_images](
	[Id] [int] IDENTITY(1,1) PRIMARY KEY,
	[ProductId] [uniqueidentifier],
	[Url] [varchar](500) NOT NULL
	FOREIGN KEY ([ProductId]) REFERENCES luxury_product(Id)
)
