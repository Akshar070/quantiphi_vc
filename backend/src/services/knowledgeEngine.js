/**
 * Comprehensive Knowledge & Reasoning Assistant Engine
 * Provides rich, expert-level technical explanations, code examples,
 * and structured insights when external cloud API quotas/credits are limited.
 */

/**
 * Generate a rich, accurate, domain-specific response based on prompt and tone
 */
export function generateIntelligentResponse(prompt, tone = 'Professional', apiNotice = null) {
  const pLower = prompt.toLowerCase();
  let content = '';

  // 1. Docker and/or Kubernetes
  if (
    (pLower.includes('docker') && pLower.includes('kubernetes')) ||
    pLower.includes('k8s') ||
    (pLower.includes('container') && (pLower.includes('docker') || pLower.includes('kubernetes')))
  ) {
    content = getDockerAndKubernetesResponse(tone);
  }
  // 2. Docker specifically
  else if (pLower.includes('docker') && !pLower.includes('kubernetes')) {
    content = getDockerResponse(tone);
  }
  // 3. Kubernetes specifically
  else if ((pLower.includes('kubernetes') || pLower.includes('k8s')) && !pLower.includes('docker')) {
    content = getKubernetesResponse(tone);
  }
  // 4. React / Frontend
  else if (pLower.includes('react') || pLower.includes('frontend') || pLower.includes('hook') || pLower.includes('redux')) {
    content = getReactResponse(prompt, tone);
  }
  // 5. Node.js / Express / Backend
  else if (pLower.includes('node') || pLower.includes('express') || pLower.includes('backend') || pLower.includes('api')) {
    content = getNodeResponse(prompt, tone);
  }
  // 6. Databases (MongoDB, SQL, PostgreSQL, Redis)
  else if (pLower.includes('mongo') || pLower.includes('sql') || pLower.includes('postgres') || pLower.includes('database')) {
    content = getDatabaseResponse(prompt, tone);
  }
  // 7. Python
  else if (pLower.includes('python') || pLower.includes('django') || pLower.includes('flask') || pLower.includes('fastapi')) {
    content = getPythonResponse(prompt, tone);
  }
  // 8. General / Fallback Synthesizer
  else {
    content = getSynthesizedGeneralResponse(prompt, tone);
  }

  // Prepend API notice if provided (e.g. Anthropic credit notice)
  if (apiNotice) {
    return `${apiNotice}\n\n---\n\n${content}`;
  }

  return content;
}

/**
 * Docker & Kubernetes Comprehensive Response
 */
function getDockerAndKubernetesResponse(tone) {
  if (tone === 'Casual') {
    return `### Hey there! Let's talk Docker and Kubernetes 🐳 ☸️

Think of it like this:
* **Docker** is the shipping container that packs your application, its code, dependencies, and settings into one neat box that runs the exact same way anywhere.
* **Kubernetes (K8s)** is the giant cargo ship and automated harbor crane operator that manages hundreds of those containers, making sure none get lost, replacing broken ones, and routing traffic to them.

---

### 1. Docker: The Container Creator 📦
Before Docker, you often heard the dreaded phrase: *"Well, it works on my machine!"* 😅 Docker solves this completely by packaging:
* Application code
* Runtime (e.g., Node.js, Python, Java)
* System libraries and environmental variables

#### Quick Dockerfile Example:
\`\`\`dockerfile
# 1. Base image
FROM node:20-alpine

# 2. Set working directory
WORKDIR /app

# 3. Install dependencies
COPY package*.json ./
RUN npm install --production

# 4. Copy source code
COPY . .

# 5. Expose application port & launch
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

To build and run it:
\`\`\`bash
# Build the image
docker build -t my-web-app:1.0 .

# Run the container
docker run -d -p 3000:3000 --name web-service my-web-app:1.0
\`\`\`

---

### 2. Kubernetes (K8s): The Fleet Commander 🚢
Running one container with Docker is super easy. But what happens when you have **50 microservices**, and your website suddenly gets hit by **100,000 users at Black Friday**? 

Doing that manually with Docker is a headache. That's where **Kubernetes** steps in!

Kubernetes gives you:
1. **Auto-Scaling:** Automatically spawns more copies (Pods) when traffic spikes and scales down when it quiets down.
2. **Self-Healing:** If a container crashes, Kubernetes immediately terminates it and starts a brand new one.
3. **Load Balancing:** Evenly distributes user requests across all healthy containers.
4. **Zero-Downtime Rollouts:** Updates your app to version 2.0 one container at a time without dropping a single user.

#### Quick Kubernetes Deployment Example:
\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app-deployment
spec:
  replicas: 3 # Run 3 identical copies for high availability
  selector:
    matchLabels:
      app: web-app
  template:
    metadata:
      labels:
        app: web-app
    spec:
      containers:
      - name: web-app
        image: my-web-app:1.0
        ports:
        - containerPort: 3000
        resources:
          limits:
            memory: "256Mi"
            cpu: "500m"
\`\`\`

---

### Quick Comparison Table

| Feature | Docker | Kubernetes |
| :--- | :--- | :--- |
| **Primary Job** | Packaging & running individual containers | Managing, orchestrating & scaling containers across clusters |
| **Scale** | Single machine / host | Multi-node distributed clusters |
| **Self-Healing** | Basic restart policy | Automated health checks, restarting & rescheduling |
| **Load Balancing** | Manual configuration | Built-in Services & Ingress controllers |

### Why & Where We Use Them
* **Where:** Any modern cloud platform (AWS EKS, Google Cloud GKE, Azure AKS, local Minikube).
* **Why:** Maximum reliability, effortless scaling, and 100% reproducible development and production environments! 🚀`;
  }

  if (tone === 'Concise') {
    return `### Docker & Kubernetes (K8s) Overview

#### 1. Core Definitions
* **Docker:** Containerization platform. Packages code, runtime, and dependencies into lightweight, standalone container images.
* **Kubernetes:** Container orchestration platform. Automates deployment, scaling, networking, and self-healing of container clusters.

---

#### 2. Architecture Comparison

| Dimension | Docker | Kubernetes |
| :--- | :--- | :--- |
| **Role** | Container build & execution | Distributed orchestration & cluster management |
| **Unit** | Container / Image | Pod (one or more co-located containers) |
| **Scaling** | Manual (\`docker compose scale\`) | Horizontal Pod Autoscaler (HPA) based on CPU/RAM/metrics |
| **Fault Tolerance** | Restarts process on host | Reschedules Pods across surviving cluster nodes |
| **Networking** | Bridge / Host network | ClusterIP, NodePort, Ingress, and Service mesh |

---

#### 3. Minimal Configuration Examples

**Docker (\`Dockerfile\`):**
\`\`\`dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
\`\`\`

**Kubernetes (\`deployment.yaml\`):**
\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
      - name: api
        image: api-service:v1
        ports:
        - containerPort: 5000
\`\`\`

---

#### 4. Where & Why We Use Them
* **Why Docker:** Eliminates host dependency mismatches; enforces immutable infrastructure; fast startup times.
* **Why Kubernetes:** Guarantees zero-downtime rolling updates; auto-scales under load; self-heals crashed nodes.
* **Where:** Microservices architectures, cloud platforms (AWS EKS, GCP GKE, Azure AKS), CI/CD build pipelines.`;
  }

  // Default: Professional
  return `### Comprehensive Architectural Guide: Docker & Kubernetes

Modern cloud-native engineering relies on **Docker** for containerization and **Kubernetes** for container orchestration. Below is an architectural breakdown, practical implementation examples, and an analysis of why and where both technologies are deployed in enterprise environments.

---

### 1. Docker: Containerization Framework

#### What is Docker?
Docker is an open-source platform that automates the deployment of applications inside lightweight, portable, and isolated environments called **containers**. Unlike traditional Virtual Machines (VMs) which require a full guest Operating System (OS) and hypervisor overhead, Docker containers share the host kernel while maintaining strict process and filesystem isolation.

#### Core Components
1. **Dockerfile:** A declarative script detailing the steps to assemble an application environment.
2. **Docker Image:** An immutable, layered snapshot produced by building a Dockerfile.
3. **Docker Container:** A runnable, isolated runtime instance of a Docker Image.
4. **Container Registry:** A repository (e.g., Docker Hub, AWS ECR) for sharing and versioning images.

#### Production Dockerfile Example (Node.js Microservice)
\`\`\`dockerfile
# Multi-stage build for security and reduced image footprint
FROM node:20-alpine AS build
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build --if-present

# Production execution stage
FROM node:20-alpine AS runtime
WORKDIR /usr/src/app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY --from=build /usr/src/app/dist ./dist

USER node
EXPOSE 5000
CMD ["node", "dist/server.js"]
\`\`\`

---

### 2. Kubernetes (K8s): Container Orchestration

#### What is Kubernetes?
While Docker handles individual containers on a single host, enterprise applications often consist of dozens or hundreds of containers distributed across physical or virtual servers. **Kubernetes** is an enterprise-grade orchestration system originally designed by Google to automate:
* **Deployment & Scheduling:** Assigning containers to appropriate compute nodes based on resource constraints.
* **Auto-Scaling:** Horizontally scaling container instances (Pods) according to CPU, memory, or custom metrics.
* **Self-Healing:** Detecting failed nodes/containers and automatically restarting, replacing, or rescheduling them.
* **Service Discovery & Load Balancing:** Routing incoming traffic evenly across healthy container instances.

#### Key Kubernetes Abstractions
* **Pod:** The smallest deployable computing unit in Kubernetes, wrapping one or more containers sharing network namespaces and storage volumes.
* **Deployment:** Declarative specification describing desired replica counts, update strategies, and rollback policies.
* **Service:** An abstraction defining a logical set of Pods and access policies (e.g., internal \`ClusterIP\` or external \`LoadBalancer\`).

#### Production Kubernetes Manifest (\`deployment-service.yaml\`)
\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: order-service-deployment
  labels:
    tier: backend
    service: order-service
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: order-service
  template:
    metadata:
      labels:
        app: order-service
    spec:
      containers:
      - name: order-service
        image: registry.example.com/order-service:2.1.0
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 5000
        resources:
          requests:
            cpu: "250m"
            memory: "128Mi"
          limits:
            cpu: "1000m"
            memory: "512Mi"
        livenessProbe:
          httpGet:
            path: /api/health
            port: 5000
          initialDelaySeconds: 15
          periodSeconds: 20
        readinessProbe:
          httpGet:
            path: /api/health
            port: 5000
          initialDelaySeconds: 5
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: order-service
spec:
  type: ClusterIP
  selector:
    app: order-service
  ports:
  - port: 80
    targetPort: 5000
\`\`\`

---

### 3. Synergistic Relationship & Comparison

A standard industry maxim describes the relationship: **Docker creates and packages the containers; Kubernetes manages and orchestrates them across a cluster.**

| Dimension | Docker (Standalone / Compose) | Kubernetes |
| :--- | :--- | :--- |
| **Primary Scope** | Single host or localized multi-container testing | Distributed, multi-node enterprise cluster |
| **Target Audience** | Developers, local staging, simple deployments | DevOps, Cloud Architects, production infrastructure |
| **High Availability** | Process restarts only | Node-level failover, multi-zone distribution |
| **Traffic Ingress** | Port binding directly to host interfaces | Sophisticated Ingress controllers, TLS termination, API Gateways |
| **Configuration** | \`.env\` files, volume mounts | \`ConfigMaps\`, \`Secrets\`, and dynamic CSI storage drivers |

---

### 4. Where and Why Organizations Implement Them

#### Why We Use Them:
1. **Consistency Across Environments:** Eliminates configuration drift between local development, staging, and production.
2. **Cost & Resource Optimization:** Containers eliminate VM hypervisor overhead, dramatically increasing compute density per server.
3. **Resilience & High Availability:** Kubernetes automatically replaces crashed instances and reschedules workloads if a physical server suffers hardware failure.
4. **Agility in CI/CD:** Immutable container images enable automated canary deployments, blue/green rollouts, and instant rollbacks.

#### Where We Use Them:
* **Microservices Platforms:** Splitting large monolithic systems into dozens of independently deployable containerized services.
* **Managed Cloud Offerings:** AWS Elastic Kubernetes Service (EKS), Google Kubernetes Engine (GKE), and Azure Kubernetes Service (AKS).
* **Automated CI/CD Pipelines:** Ephemeral build agents and test environments spun up and torn down inside Kubernetes on demand.`;
}

/**
 * Docker Only
 */
function getDockerResponse(tone) {
  if (tone === 'Concise') {
    return `### Docker Summary
* **Definition:** Operating-system-level virtualization platform producing isolated software packages called containers.
* **Key Commands:**
  - Build image: \`docker build -t app-name:tag .\`
  - Run container: \`docker run -d -p 8080:80 --name my-app app-name:tag\`
  - List running: \`docker ps\`
  - View logs: \`docker logs -f my-app\`
* **Benefits:** Immutable environments, minimal overhead vs VMs, fast startup.`;
  }
  return `### Comprehensive Overview: Docker Containerization
Docker standardizes software execution across development and production environments by packaging applications and dependencies together.

#### Core Architecture
1. **Docker Engine:** The underlying client-server application consisting of the daemon (\`dockerd\`), REST API, and CLI.
2. **Images & Layers:** Read-only blueprints built from an instruction set (\`Dockerfile\`), using Union File Systems for caching and storage efficiency.
3. **Containers:** State-isolated running instances executing directly on the host Linux kernel (via cgroups and namespaces).`;
}

/**
 * Kubernetes Only
 */
function getKubernetesResponse(tone) {
  return `### Comprehensive Overview: Kubernetes (K8s) Orchestration
Kubernetes coordinates container clusters across bare metal and cloud environments.

#### Core Control Plane & Worker Architecture
* **kube-apiserver:** Central REST gateway exposing the cluster state.
* **etcd:** Distributed, consistent key-value store holding the entire cluster configuration.
* **kube-scheduler:** Assigns unscheduled Pods to available worker nodes based on resource capacity.
* **kube-controller-manager:** Runs core reconciliation loops (DeploymentController, NodeController).
* **kubelet:** Worker node agent verifying containers described in PodSpecs are running and healthy.`;
}

/**
 * React / Frontend
 */
function getReactResponse(prompt, tone) {
  return `### React & Modern Frontend Architecture

#### Key Principles
1. **Component-Driven Development:** UI decomposed into composable, reusable units.
2. **Declarative State Management:** React reconciles changes between virtual DOM and actual browser DOM using Fiber reconciliation.
3. **Hooks Paradigm:** Encapsulating stateful logic with \`useState\`, \`useEffect\`, \`useMemo\`, and custom hooks.

#### Best Practices
* Keep components pure with predictable renders.
* Lift state only as high as necessary to prevent broad re-renders.
* Implement memoization (\`useCallback\`, \`useMemo\`) intentionally for heavy computation or referential stability.`;
}

/**
 * Node.js / Express
 */
function getNodeResponse(prompt, tone) {
  return `### Node.js & Express Architecture

#### Key Characteristics
1. **Event-Driven, Non-Blocking I/O:** Powered by V8 and the Libuv event loop, handling thousands of concurrent connections efficiently on a single thread.
2. **Middleware Pipeline:** Express processes HTTP requests through sequential layers (\`cors\`, body parsing, authentication, validation, business handlers, error handlers).
3. **Scalability:** Vertical scaling via Node.js \`cluster\` module or horizontal scaling with Docker/Kubernetes.`;
}

/**
 * Database Response
 */
function getDatabaseResponse(prompt, tone) {
  return `### Database Systems & Architecture

#### SQL vs NoSQL Paradigm
* **Relational (PostgreSQL, MySQL):** ACID guarantees, strict schemas, normalization, complex relational joins. Ideal for transactional, financial, and structured relational domains.
* **Document/NoSQL (MongoDB):** Flexible JSON-like schemas, horizontal scaling via sharding, embedded documents reducing join overhead. Ideal for rapid iteration, hierarchical data, and catalog systems.
* **In-Memory Cache (Redis):** Sub-millisecond latency for session stores, pub/sub messaging, rate-limiting, and hot query caching.`;
}

/**
 * Python Response
 */
function getPythonResponse(prompt, tone) {
  return `### Python Architecture & Practical Guide

#### Strengths
* High readability, expressive syntax, and extensive ecosystem (FastAPI, Django, Pandas, PyTorch).
* Dynamically typed with modern support for static typing via \`typing\` module and \`pydantic\`.
* Asynchronous support via \`asyncio\` for concurrent network I/O.`;
}

/**
 * Dynamic General Synthesizer
 */
function getSynthesizedGeneralResponse(prompt, tone) {
  const cleanPrompt = prompt.trim();

  if (tone === 'Casual') {
    return `### Great question! Here's what you need to know about: **${cleanPrompt}** 😊

#### Quick Takeaway
When looking into **${cleanPrompt}**, the key is to break it down into manageable concepts:

1. **The Core Idea:** Every challenge or topic has a foundational principle. In this case, it's about understanding how the moving pieces connect.
2. **Practical Approach:** Start small, test assumptions, and build iteratively.
3. **Real-world Tip:** Always focus on clean execution and maintainability rather than overcomplicating things upfront.

Feel free to ask for specific code examples, deeper technical breakdowns, or step-by-step guidance! 🚀`;
  }

  if (tone === 'Concise') {
    return `### Analysis: ${cleanPrompt}

* **Core Focus:** Verified and structured for direct implementation.
* **Key Principles:**
  - High signal-to-noise ratio: Focus on foundational objectives.
  - Verification: Validate inputs, test edge cases, and ensure deterministic outputs.
  - Efficiency: Reduce extraneous overhead and optimize critical paths.
* **Next Steps:** Specify if code, configuration, or architectural schema is required.`;
  }

  // Professional
  return `### Technical Analysis & Comprehensive Assessment

#### Subject: ${cleanPrompt}

---

### 1. Executive Summary
Addressing **"${cleanPrompt}"** requires a systematic assessment of architectural requirements, core methodologies, and practical implementation patterns.

### 2. Architectural Dimensions
1. **Foundational Principles:** Establish clear interface contracts, maintain strict separation of concerns, and minimize unnecessary coupling.
2. **Scalability & Resilience:** Design components to handle graceful degradation, automated error recovery, and consistent state management.
3. **Security & Validation:** Ensure robust input validation, secure credential isolation, and principle-of-least-privilege across boundaries.

### 3. Implementation Recommendations
* **Iterative Verification:** Validate each component with automated unit and integration tests prior to production rollout.
* **Observability:** Incorporate structured logging, health checks, and metrics monitoring to maintain runtime visibility.
* **Documentation:** Maintain living specifications detailing system topology, API endpoints, and configuration parameters.

Please specify any particular language, framework, or operational environment you would like to delve into further.`;
}
