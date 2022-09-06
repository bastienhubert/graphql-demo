// Tool allowing you to generate GraphQL type definitions from an existing database.
const { toGraphQLTypeDefs } = require("@neo4j/introspector");
const neo4j = require("neo4j-driver");
const fs = require("fs");

const driver = neo4j.driver(
  "bolt://localhost:7687",
  neo4j.auth.basic("neo4j", "myDemoPassword")
);

const sessionFactory = () =>
  driver.session({ defaultAccessMode: neo4j.session.READ });

async function main() {
  const typeDefs = await toGraphQLTypeDefs(sessionFactory);
  fs.writeFileSync(`${__dirname}/schema.graphql`, typeDefs);
  await driver.close();
}
main();
