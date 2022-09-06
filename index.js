// Takes your GraphQL type definitions and generates a schema backed by a Neo4j database for you.
const { Neo4jGraphQL } = require("@neo4j/graphql");
// Used by the Neo4j GraphQL Library to generate a schema and execute queries and mutations.
const { ApolloServer, gql } = require("apollo-server");
const neo4j = require("neo4j-driver");

const driver = neo4j.driver(
  "bolt://localhost:7687",
  neo4j.auth.basic("neo4j", "myDemoPassword")
);

const typeDefs = gql`
  type Movie {
    box: Int!
    bond: Person! @relationship(type: "AS_BOND_IN", direction: IN)
    bondVehicles: [Vehicle!]! @relationship(type: "HAS_BOND_VEHICLE", direction: OUT)
    otherVehicles: [Vehicle!]! @relationship(type: "HAS_OTHER_VEHICLE", direction: OUT)
    title: String!
    year: Int!
  }

  type Person {
    movies: [Movie!]! @relationship(type: "AS_BOND_IN", direction: OUT)
    name: String!
    # vehicles: [Vehicle!]!
    # @cypher(
    #  statement: """
    #  MATCH (this)-[:AS_BOND_IN]->()-[:HAS_BOND_VEHICLE]->(v)
    #  RETURN DISTINCT v ORDER BY v.model ASC
    #  """
    # )
  }

  type Vehicle {
    brand: String!
    model: String!
    moviesAsBondVehicle: [Movie!]! @relationship(type: "HAS_BOND_VEHICLE", direction: IN)
    moviesAsOtherVehicle: [Movie!]! @relationship(type: "HAS_OTHER_VEHICLE", direction: IN)
  }

  # Custom query
  type Query {
    getTop3JamesBondVehicles: [Vehicle!]!
    @cypher(
      statement: """
        MATCH (v:Vehicle)<-[:HAS_BOND_VEHICLE]-(m:Movie)
        WITH v, count(m) AS nbMovies
        RETURN v {.*, nbMovies} ORDER BY nbMovies DESC LIMIT 3
      """
    )
  }
`;

const neoSchema = new Neo4jGraphQL({ typeDefs, driver });

neoSchema.getSchema().then((schema) => {
  const server = new ApolloServer({
    schema,
  });

  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
});
