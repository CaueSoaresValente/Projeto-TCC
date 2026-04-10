<template>
  <div class="flex">
    <div
      class="bg-red-600 text-white px-9 py-5 [clip-path:polygon(0%_0%,_100%_0%,_70%_100%,_0%_100%)] text-center text-5xl font-black italic tracking-tighter tracking-wide"
      style="font-family: &quot;Archivo Black&quot;, sans-serif"
    >
      <h1 class="ms-4 relative -left-10">SENAI</h1>
    </div>
    <div class="w-full divmain">
      <div>
        <div class="bg-red-600 w-full">
          <div class="p-1 bg-red-600 relative -left-3 w-full"></div>
        </div>
        <div class="bg-white flex justify-end me-25 dark:bg-[#121212]">
          <slot></slot>
        </div>
      </div>
    </div>
    
  </div>
  
</template>

<style scoped>

</style>