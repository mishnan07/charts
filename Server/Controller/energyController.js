
// controller.js
import mongoose from "mongoose";

export const getData = async (req, res) => {
  try {
    const db = mongoose.connection;

    if (db.readyState === 1) {
      const collection = db.collection('energy');
      const data = await collection.find({}).toArray();
      res.status(200).json(data);
    } else {
      res.status(500).json({ message: 'Database not connected' });
    }
  } catch (error) {
    console.error('Error fetching data: ', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};



export const table = async (req, res) => {
  try {
    const db = mongoose.connection;
    const page = +req.query.page || 1; // Pagination - default to page 1
    const limit = 10; // Number of items per page

    if (db.readyState === 1) {
      const collection = db.collection('energy');
      const count = await collection.countDocuments(); // Count total documents

      const data = await collection
      .find({ country: { $ne: '' } }) // Exclude documents where country is null
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();
    

      res.json({
        data,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      });

    } else {
      res.status(500).json({ message: 'Database not connected' });
    }

  } catch (error) {
    console.error('Error fetching data: ', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};


export const cyclic = async (req, res) => {
  try {
    const db = mongoose.connection;

    if (db.readyState === 1) {
      const collection = db.collection('energy');
      const data = await collection.aggregate([
        {
          $project: {
            intensity: 1,
            relevance: 1,
            likelihood: 1,
            published: 1,
            _id: 0
          }
        }
      ]).toArray();
      
      res.status(200).json(data);
    } else {
      res.status(500).json({ message: 'Database not connected' });
    }
  } catch (error) {
    console.error('Error fetching data: ', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};


export const region = async (req, res) => {
  try {
    const db = mongoose.connection;

    if (db.readyState === 1) {
      const collection = db.collection('energy');
      const data = await collection.aggregate([ { $group: { _id: "$region", count: { $count: {} } } }, { $project: { _id: 0, region: "$_id", count: 1 }},{$sort:{count:-1}},{$skip:1},{$limit:4}]).toArray();
      res.status(200).json(data);
    } else {
      res.status(500).json({ message: 'Database not connected' });
    }
  } catch (error) {
    console.error('Error fetching data: ', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const count = async (req, res) => {
  try {
    const db = mongoose.connection;

    if (db.readyState === 1) {
      const collection = db.collection('energy');
      const uniqueCountries = await collection.distinct('country');
      const uniqueRegions = await collection.distinct('region');
      const uniqueTopics = await collection.distinct('topic');
      const uniqueSectors = await collection.distinct('sector');

      const countryCount = uniqueCountries.length;
      const regionCount = uniqueRegions.length;
      const topicCount = uniqueTopics.length;
      const sectorCount = uniqueSectors.length;

      res.status(200).json({ countryCount, regionCount, topicCount, sectorCount });
    } else {
      res.status(500).json({ message: 'Database not connected' });
    }
  } catch (error) {
    console.error('Error fetching data: ', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};





export const countryData = async (req, res) => {
  try {
    regionAndTopic()
    const db = mongoose.connection;

    if (db.readyState === 1) {
      const collection = db.collection('energy');
      const countries = await collection.aggregate([
        {
          $group: {
            _id: "$country",
            count: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            country: "$_id",
            count: 1
          }
        },
        {
          $sort: { count: -1 }
        },
        {
          $skip: 1
        },
        {
          $limit: 5
        }
      ]).toArray();

      res.json(countries);
    } else {
      res.status(500).json({ message: 'Database not connected' });
    }

  } catch (error) {
    res.status(500).json({ message: 'An error occurred' });
  }
};


export const regionAndTopic = async (req, res) => {
  try {
    const db = mongoose.connection;

    if (db.readyState === 1) {
      const collection = db.collection('energy');
      const data = await collection.aggregate([
        {
          $group: {
            _id: { region: "$region", topic: "$topic" },
            count: { $sum: 1 }
          }
        },
        {
          $group: {
            _id: "$_id.region",
            totalTopics: { $sum: 1 },
            topics: {
              $push: {
                topic: "$_id.topic",
                count: "$count"
              }
            }
          }
        },
        {
          $sort: { totalTopics: -1 }
        },
        {
          $limit: 3
        },
        {
          $project: {
            _id: 0,
            region: "$_id",
            topics: {
              $slice: ["$topics", 3]
            }
          }
        },
        {
          $project: {
            region: 1,
            topics: {
              $arrayToObject: {
                $filter: {
                  input: { $map: { input: "$topics", as: "t", in: { k: "$$t.topic", v: "$$t.count" } } },
                  as: "item",
                  cond: { $ne: ["$$item.k", ""] }
                }
              }
            }
          }
        }
      ]).toArray(); // Execute the aggregation

      res.json(data);

    } else {
      console.log('Database not connected');
    }
  } catch (error) {
    console.log('Error:', error);
  }
};





