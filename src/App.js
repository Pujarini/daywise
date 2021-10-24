import React,{useState} from 'react';
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';
import _ from 'lodash';
import {v4} from 'uuid';
import './App.css';

const task={
  id:v4(),
  taskDescription:"Clean room",
}

const task1={
  id:v4(),
  taskDescription:"Clean bed",
}

const App = () => {
  const [text, settext] = useState(null)
   const [items, setitems] = useState({
    "planned":{
      title: "planned",
      tasks:[task,task1]
    },
     "done":{
       title:"done",
       tasks:[]
     }
   })

   const handleDragEnd =({destination, source})=>{
      if(!destination){
        return
      }
      if(destination.index === source.index && destination.droppableId === source.droppableId){
        return;
      }

      const itemCopy= {...items[source.droppableId].tasks[source.index]};
      console.log(itemCopy);

      setitems(prev=>{
        prev={...prev}
        prev[source.droppableId].tasks.splice(source.index,1);//remove item from source
        prev[destination.droppableId].tasks.splice(destination.index,0,itemCopy); // add removed item to desination
        return prev
      })
   }

   const addItems=()=>{
      setitems(prev=>{
        return{
          ...prev,
          planned:{
            title:"planned",
            tasks:[...prev.planned.tasks,{
              id:v4(),
              taskDescription:text
            }]
          }
        }
      })
      settext("");
   }

  return (
    <div className="App">
    <div className="Header">Day wise</div>
    <div className="addtask">
    <input value={text} onChange={(e)=>settext(e.target.value)} placeholder="What is your plan?"></input>
    <button onClick={addItems}>Add task</button>
    </div>
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="column-list">
      {_.map(items,(data,index)=>{
       return(
       <div className="column">
         <h1>{data.title}</h1>
         <Droppable droppableId={index}>
          {(provided, snapshot)=>{
            return (
              <div ref={provided.innerRef}
                {...provided.droppableProps} className="droppable-col">
                  {data.tasks.map((task,index)=>{
                    return(
                      <Draggable key={task.id} index={index} draggableId={task.id}>
                        {(provided, snapshot)=>{
                          return(
                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className={`draggable-item ${snapshot.isDragging && "dragging"} ${data.title}`}>
                                {task.taskDescription}
                            </div>
                          )
                        }}
                      </Draggable>
                    )
                  })}
              {provided.placeholder}
              </div>
            )
          }}
         </Droppable>
       </div>
       )
      })}
      </div>
    </DragDropContext>
  </div>
  )
}

export default App;