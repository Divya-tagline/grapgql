const { ApolloServer, gql } = require("apollo-server");
// const { CodeStarNotifications } = require("aws-sdk");
// const AWS = require("aws-sdk");
const fs = require("fs");

// AWS.config.loadFromPath("./credentials.json");

// c/onst s3 = new AWS.S3({ apiVersion: "2006-03-01" });
console.log("run");
// debugger;
const typeDefs = gql`
  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  type Query {
    _: Boolean
  }

  type Mutation {
    singleUpload(file: Upload): File
    singleUploadStream(file: Upload): File
  }
`;

const resolvers = {
  Mutation: {
    singleUpload:async (parent, args) => {
      try {
        console.log(args.file);
        const file = args.file;
       // return args.file.then(file => {
          console.log("data");
          const { stream, mimetype } = await args.file;
          console.log("gdadsfds",stream);
        //  let stream = await fs.createReadStream(`./uploadedFiles`);
        await stream.pipe(fs.createWriteStream(`./uploadedFiles/${filename}`));
        await fs.createWriteStream(`./uploadedFiles/${file.filename}`);
        //  return stream;
          //Contents of Upload scalar: https://github.com/jaydenseric/graphql-upload#class-graphqlupload/
          //file.createReadStream() is a readable node stream that contains the contents of the uploaded file/
          //node stream api: https://nodejs.org/api/stream.html
         // return file;
       // });
        // const { createReadStream, filename, mimetype } = args.file;

        //   const fileStream = await createReadStream();

        // await fileStream.pipe(
        //   fs.createWriteStream(`./uploadedFiles/${filename}`)
        // );

        /*return args.file.then(async (file) => {
          
          

          return file;
        });*/
      } catch (e) {
        console.log(e);
      }
    },
    /* singleUploadStream: async (parent, args) => {
      const file = await args.file;
      const { createReadStream, filename, mimetype } = file;
      const fileStream = createReadStream();

      const uploadParams = {
        Bucket: "apollo-file-upload-test",
        Key: filename,
        Body: fileStream,
      };
      // const result = await s3.upload(uploadParams).promise();

      console.log(result);

      return file;
    },*/
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen(3000).then(({ url }) => {
  console.log(`\`🚀  Server ready at ${url}`);
});
