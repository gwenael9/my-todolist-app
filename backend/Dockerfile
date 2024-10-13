# Étape 1 : Utiliser une image Maven pour construire et exécuter l'application
FROM maven:latest

# Définir le répertoire de travail
WORKDIR /app

# Copier le fichier pom.xml et télécharger les dépendances
COPY pom.xml ./
RUN mvn dependency:go-offline

# Copier le code source
COPY src ./src

# Exposer le port sur lequel l'application écoute
EXPOSE 8080

# Commande pour exécuter l'application en mode développement
CMD ["mvn", "spring-boot:run"]
