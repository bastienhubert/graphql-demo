# Simple Neo4j GraphQL library showcase

DB dump is available in ./db/james_bond_db.dump

## GraphQL Queries

- Get all movies
```
query {
  movies{
    title
    box
    bond {
      name
    }
  }
}
```

- Get Sean Connery movies
```
query {
  movies (where: {bond: {name: "Sean Connery"}}){
    title
    box
  }
}
```

OR

```
query {
  people (where: {name: "Sean Connery"}){
    movies {
      title
    }
  }
}
```


- Get Sean Connery vehicles (uncomment line 25 to 31 in index.js to make it work)
```
query {
  people (where: {name: "Sean Connery"}){
    name
    vehicles {
      brand
      model
    }
  }
}
```

- Get top 3 James Bond vehicles
```
query {
  getTop3JamesBondVehicles {
    brand
    model
  }
}
```