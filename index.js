import express from 'express';
import db from './db/conn.js';

const PORT = 3000;
const app = express();

app.get('/grades/stats', async (req, res, next) => {
    let connection = await db.collection('grades');
    let totalStudents = await connection.aggregate(
        [
            {
              '$unwind': {
                'path': '$scores'
              }
            }, {
              '$group': {
                '_id': '$student_id', 
                'quiz': {
                  '$push': {
                    '$cond': {
                      'if': {
                        '$eq': [
                          '$scores.type', 'quiz'
                        ]
                      }, 
                      'then': '$scores.score', 
                      'else': '$$REMOVE'
                    }
                  }
                }, 
                'exam': {
                  '$push': {
                    '$cond': {
                      'if': {
                        '$eq': [
                          '$scores.type', 'exam'
                        ]
                      }, 
                      'then': '$scores.score', 
                      'else': '$$REMOVE'
                    }
                  }
                }, 
                'homework': {
                  '$push': {
                    '$cond': {
                      'if': {
                        '$eq': [
                          '$scores.type', 'homework'
                        ]
                      }, 
                      'then': '$scores.score', 
                      'else': '$$REMOVE'
                    }
                  }
                }
              }
            }, {
              '$project': {
                '_id': 0, 
                'class_id': '$_id', 
                'avg': {
                  '$sum': [
                    {
                      '$multiply': [
                        {
                          '$avg': '$exam'
                        }, 0.5
                      ]
                    }, {
                      '$multiply': [
                        {
                          '$avg': '$quiz'
                        }, 0.3
                      ]
                    }, {
                      '$multiply': [
                        {
                          '$avg': '$homework'
                        }, 0.2
                      ]
                    }
                  ]
                }
              }
            }, {
              '$group': {
                '_id': null, 
                'class_id': {
                  '$push': '$class_id'
                }, 
                'totalStudents': {
                  '$sum': 1
                }, 
                'above60Students': {
                  '$sum': {
                    '$cond': {
                      'if': {
                        '$gt': [
                          '$avg', 60
                        ]
                      }, 
                      'then': 1, 
                      'else': 0
                    }
                  }
                }
              }
            }, {
              '$project': {
                'totalStudents': '$totalStudents', 
                'above60Students': '$above60Students', 
                'ratio': {
                  '$divide': [
                    '$above60Students', '$totalStudents'
                  ]
                }
              }
            }
          ]
    ).toArray();
        res.send(totalStudents);
    
})

app.get('/grades/stats/:id', async (req, res) => {
    let collection = await db.collection('grades')
    let result = await collection.aggregate(
        [
            {
              '$match': {
                'class_id': Number(req.params.id)
              }
            }, {
              '$unwind': {
                'path': '$scores'
              }
            }, {
              '$group': {
                '_id': '$student_id', 
                'quiz': {
                  '$push': {
                    '$cond': {
                      'if': {
                        '$eq': [
                          '$scores.type', 'quiz'
                        ]
                      }, 
                      'then': '$scores.score', 
                      'else': '$$REMOVE'
                    }
                  }
                }, 
                'exam': {
                  '$push': {
                    '$cond': {
                      'if': {
                        '$eq': [
                          '$scores.type', 'exam'
                        ]
                      }, 
                      'then': '$scores.score', 
                      'else': '$$REMOVE'
                    }
                  }
                }, 
                'homework': {
                  '$push': {
                    '$cond': {
                      'if': {
                        '$eq': [
                          '$scores.type', 'homework'
                        ]
                      }, 
                      'then': '$scores.score', 
                      'else': '$$REMOVE'
                    }
                  }
                }
              }
            }, {
              '$project': {
                '_id': 0, 
                'class_id': '$_id', 
                'avg': {
                  '$sum': [
                    {
                      '$multiply': [
                        {
                          '$avg': '$exam'
                        }, 0.5
                      ]
                    }, {
                      '$multiply': [
                        {
                          '$avg': '$quiz'
                        }, 0.3
                      ]
                    }, {
                      '$multiply': [
                        {
                          '$avg': '$homework'
                        }, 0.2
                      ]
                    }
                  ]
                }
              }
            }, {
              '$group': {
                '_id': null, 
                'class_id': {
                  '$push': '$class_id'
                }, 
                'totalStudents': {
                  '$sum': 1
                }, 
                'above60Students': {
                  '$sum': {
                    '$cond': {
                      'if': {
                        '$gt': [
                          '$avg', 60
                        ]
                      }, 
                      'then': 1, 
                      'else': 0
                    }
                  }
                }
              }
            }, {
              '$project': {
                'totalStudents': '$totalStudents', 
                'above60Students': '$above60Students', 
                'ratio': {
                  '$divide': [
                    '$above60Students', '$totalStudents'
                  ]
                }
              }
            }
          ]
    ).toArray();
    console.log(result);
    res.send(result);
})


app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})