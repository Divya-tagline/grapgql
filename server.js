const express = require("express");
const { createServer } = require("http");
const { PubSub } = require("apollo-server");
const { ApolloServer, gql } = require("apollo-server-express");

const app = express();

const pubsub = new PubSub();
const MESSAGE_CREATED = "MESSAGE_CREATED";
const STUDENT_CREATED = "STUDENT_CREATED";
const CLOCK = "CLOCK";

const typeDefs = gql`
  type Query {
    messages: [Message!]!
    student(_id: String): [Student]
    time: Time
  }
  type Student_database {
    _id: String
    firstname: String
    lastname: String
    email: String
    error:String
  }
  type Subscription {
    messageCreated: Message
    studentCreated: Student
    clock: Time
  }

  type Mutation {
    createStudent(
      firstname: String
      lastname: String
      email: String
    ): [Student_database]
  }

  type Student {
    firstname: String
    lastname: String
    email: String
    error: String
  }

  type Message {
    id: ID!
    content: String
  }

  type Time {
    hour: String
    minute: String
    second: String
  }
`;

//let studentData = [];
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27018/demo");
const Schema = mongoose.Schema;
const studentSchema = new Schema({
  firstname: String,
  lastname: String,
  email: String,
});
const Student = mongoose.model("Student", studentSchema);
const resolvers = {
  Query: {
    messages: () => [
      { id: 0, content: "Hello!" },
      { id: 1, content: "Bye!" },
    ],
    student: async (root, args) => {
      // console.log(args._id);
      const s = await Student.findById({ _id: args._id }).exec();
      const student = [
        {
          //  _id: s._id,
          firstname: s.firstname,
          lastname: s.lastname,
          email: s.email,
        },
      ];
      // console.log(student);
      // return studentData;
      return student;
    },

    time: () => [],
  },
  Mutation: {
    createStudent: async (root, args, context, info) => {
      let newstudent = new Student({
        firstname: args.firstname,
        lastname: args.lastname,
        email: args.email,
      });
      const student = await  Student.findOne({
        firstname: newstudent.firstname
      });
      if (student) {
        return [{error : "userexist"}];
      } else {
        await newstudent.save();
        // pubsub.publish(STUDENT_CREATED, { studentCreated: newstudent });
        pubsub.publish(STUDENT_CREATED, { studentCreated: newstudent });
        pubsub.publish(CLOCK, {
          clock: {
            hour: new Date().getHours(),
            minute: new Date().getMinutes(),
            second: new Date().getSeconds(),
          },
        });
        return [newstudent];
      }
    },
  },
  Subscription: {
    messageCreated: {
      subscribe: () => pubsub.asyncIterator(MESSAGE_CREATED),
    },
    studentCreated: {
      subscribe: () => pubsub.asyncIterator(STUDENT_CREATED),
    },
    clock: {
      subscribe: () => pubsub.asyncIterator(CLOCK),
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.applyMiddleware({ app, path: "/graphql" });

const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen({ port: 8000 }, () => {
  console.log("Apollo Server on http://localhost:8000/graphql");
});
