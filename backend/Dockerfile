FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY MyIfs.Api/MyIfs.Api.csproj MyIfs.Api/
RUN dotnet restore MyIfs.Api/MyIfs.Api.csproj
COPY . .
RUN dotnet publish MyIfs.Api/MyIfs.Api.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 5000
ENTRYPOINT ["dotnet", "MyIfs.Api.dll"]
