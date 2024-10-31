<template>
  <div class="not-found">
    <div class="background-squares">
      <a-result
        status="404"
        title="404"
        sub-title="你访问的页面不存在，可能它去霍格沃兹旅行了..."
      >
        <template #extra>
          <a-button type="primary" @click="goHome"> 回到首页 </a-button>
        </template>
      </a-result>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

function goHome() {
  router.push("/");
}
</script>

<style scoped>
.not-found {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%);
  position: relative;
  overflow: hidden;
}

.background-squares {
  width: 800px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 20px;
  position: relative;
  z-index: 2;
}

.background-squares img {
  height: 300px;
  margin-right: 20px;
}

.floating-squares {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.square {
  width: 100px;
  height: 100px;
  background-color: #6b778c;
  border-radius: 10px;
  position: absolute;
  bottom: -50px;
  animation: float 6s infinite ease-in-out;
}

@keyframes float {
  0% {
    transform: translateX(0) translateY(0);
  }
  50% {
    transform: translateX(20px) translateY(-30px);
  }
  100% {
    transform: translateX(0) translateY(0);
  }
}

/* Adjust square position and animation delay for each square */
.square:nth-child(odd) {
  left: 10%;
  animation-delay: -3s;
}

.square:nth-child(even) {
  right: 10%;
  animation-delay: -1.5s;
}
</style>
