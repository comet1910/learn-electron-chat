<template>
    <div class="message-input w-full  shadow-sm border rounded-lg border-gray-300 py-1 px-2 focus-within:border-green-700">
      <!-- <div  class="mb-2 relative flex items-center">
        <img class="h-24 w-24 object-cover rounded">
      </div> -->
      <div class="flex items-center">
        <input type="file"  ref="fileInput" class="hidden">
        <!-- <Icon 
          icon="radix-icons:image" 
          width="24" 
          height="24" 
          
        /> -->
        <input class="outline-none border-0 flex-1 bg-white focus:ring-0" type="text" >
        <Button icon-name="radix-icons:paper-plane" >
           发送
        </Button>
      </div>
    </div>
  </template>
    
  <script lang="ts" setup>
  import { ref } from 'vue'
  import { Icon } from '@iconify/vue'
 
  
  </script>