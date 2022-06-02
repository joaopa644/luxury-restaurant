CREATE TABLE [dbo].[luxury_restaurant_images](
	[Id] [int] IDENTITY(1,1) PRIMARY KEY,
	[RestaurantId] [uniqueidentifier],
	[Url] [varchar](500) NOT NULL
	FOREIGN KEY ([RestaurantId]) REFERENCES luxury_restaurant(Id)
)