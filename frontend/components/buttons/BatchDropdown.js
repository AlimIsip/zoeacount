"use client";
import {Dropdown, 
  DropdownTrigger, 
  DropdownMenu, 
  DropdownItem, 
  Button} from "@heroui/react";


export default function BatchDropdown({timelineData, updateTable }) {

   const batchData = [...new Set(timelineData.map(item => item.batch))];
   console.log(typeof batchData[0])
  
  return (
      <>
       <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered">SetBatch</Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions" onAction={(batchNum) => {updateTable(Number(batchNum));}}>
      {batchData.map((batchNum) => (
        <DropdownItem key={batchNum}>{batchNum}</DropdownItem>
      ))}
      </DropdownMenu>
    </Dropdown>
      </>
      
    )
}
