import { BoardAnalysisResult } from "@/types/scholar";

export interface SampleBoard {
  id: string;
  title: string;
  topic: string;
  category: string;
  thumbnailSvg: string; // Base64 Data URI of rendered high-contrast chalkboard
  presetAnalysis: BoardAnalysisResult;
}

// Generate an SVG data URI of a chalkboard
function createChalkboardSvg(title: string, formulas: string[], accent: string = "#38bdf8") {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 650" width="100%" height="100%">
    <defs>
      <radialGradient id="chalkGlow" cx="50%" cy="50%" r="70%">
        <stop offset="0%" stop-color="#141c19"/>
        <stop offset="100%" stop-color="#080c0a"/>
      </radialGradient>
      <filter id="chalkTexture">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/>
        <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.12 0" in="noise" result="coloredNoise"/>
        <feComposite operator="in" in2="SourceGraphic"/>
      </filter>
    </defs>
    <!-- Dark slate chalkboard background -->
    <rect width="1000" height="650" fill="url(#chalkGlow)"/>
    <!-- Chalkboard border -->
    <rect x="15" y="15" width="970" height="620" rx="10" fill="none" stroke="#2d3d36" stroke-width="8"/>
    <rect x="25" y="25" width="950" height="600" rx="6" fill="none" stroke="#1c2823" stroke-width="2"/>
    
    <!-- Chalk smudge lines -->
    <path d="M 50 120 Q 300 115 550 125 T 950 120" stroke="rgba(255,255,255,0.08)" stroke-width="3" fill="none"/>
    <path d="M 60 380 Q 400 375 750 385" stroke="rgba(255,255,255,0.05)" stroke-width="2" fill="none"/>

    <!-- Header / Title -->
    <text x="60" y="85" font-family="monospace, sans-serif" font-size="30" font-weight="bold" fill="#f1f5f9" letter-spacing="1.5">
      ${title.toUpperCase()}
    </text>
    <text x="750" y="85" font-family="monospace, sans-serif" font-size="16" fill="${accent}">
      [LECTURE DERIVATION]
    </text>

    <!-- Formula Lines -->
    <g font-family="serif" font-style="italic" fill="#ffffff" filter="url(#chalkTexture)">
      <text x="70" y="180" font-size="26" fill="#e2e8f0">${formulas[0] || ""}</text>
      <text x="70" y="250" font-size="24" fill="${accent}">${formulas[1] || ""}</text>
      <text x="70" y="320" font-size="24" fill="#cbd5e1">${formulas[2] || ""}</text>
      <text x="70" y="400" font-size="24" fill="#f8fafc">${formulas[3] || ""}</text>
      <text x="70" y="480" font-size="23" fill="${accent}">${formulas[4] || ""}</text>
      <text x="70" y="550" font-size="22" fill="#94a3b8">${formulas[5] || ""}</text>
    </g>

    <!-- Geometric Chalk Diagram on Right -->
    <g transform="translate(680, 220)" stroke="#38bdf8" stroke-width="2.5" fill="none" opacity="0.85">
      <circle cx="100" cy="100" r="85" stroke-dasharray="6 4"/>
      <line x1="100" y1="15" x2="100" y2="185" stroke="rgba(255,255,255,0.4)"/>
      <line x1="15" y1="100" x2="185" y2="100" stroke="rgba(255,255,255,0.4)"/>
      <path d="M 100 100 L 160 40" stroke="#f43f5e" stroke-width="3"/>
      <circle cx="160" cy="40" r="6" fill="#f43f5e"/>
      <text x="175" y="45" font-family="serif" font-size="20" fill="#f43f5e" font-style="italic">|Ψ(t)⟩</text>
      <path d="M 100 70 A 30 30 0 0 1 125 78" stroke="#fbbf24" stroke-width="2"/>
      <text x="135" y="70" font-family="serif" font-size="16" fill="#fbbf24">θ</text>
      <text x="50" y="240" font-family="monospace" font-size="14" fill="#94a3b8">Fig. State Vector In Hilbert Space</text>
    </g>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const SAMPLE_BOARDS: SampleBoard[] = [
  {
    id: "quantum-mechanics",
    title: "Quantum Wave Mechanics & Schrödinger Dynamics",
    topic: "Quantum Physics & Operator Theory",
    category: "Physics / Quantum",
    thumbnailSvg: createChalkboardSvg(
      "Quantum State Evolution & Propagators",
      [
        "1. iℏ ∂/∂t |Ψ(t)⟩ = Ĥ |Ψ(t)⟩",
        "2. Ĥ = -(ℏ²/2m) ∇² + V(r, t)",
        "3. Û(t, t₀) = exp(-iĤ(t - t₀)/ℏ)",
        "4. Ψ(x,t) = Σ c_n ϕ_n(x) exp(-iE_n t / ℏ)",
        "5. J(x,t) = (ℏ/2mi) [Ψ* ∇Ψ - Ψ ∇Ψ*]",
        "6. ∂ρ/∂t + ∇·J = 0   [Continuity Equation]"
      ],
      "#38bdf8"
    ),
    presetAnalysis: {
      courseCode: "PHYS301",
      courseName: "Quantum Mechanics & Physics",
      topicTitle: "Time-Dependent Schrödinger Dynamics & Quantum Propagators",
      summary: "Rigorous treatment of wave function unitary evolution, Hamiltonian spectral decomposition into stationary eigenstates, and probability current conservation in Hilbert space.",
      structuredNotes: `### 1. Fundamental Postulate & Time Evolution

In non-relativistic quantum theory, the state vector $|\\psi(t)\\rangle$ resides in a complex Hilbert space $\\mathcal{H}$.

The temporal propagation is governed by the **Time-Dependent Schrödinger Equation**:

$$i\\hbar \\frac{\\partial}{\\partial t} |\\psi(t)\\rangle = \\hat{H} |\\psi(t)\\rangle$$

Where the Hamiltonian operator $\\hat{H}$ is defined in Cartesian coordinates as:

$$\\hat{H} = -\\frac{\\hbar^2}{2m} \\nabla^2 + V(\\mathbf{r}, t)$$

---

### 2. Spectral Theorem & Stationary States

For a conservative system where $\\frac{\\partial V}{\\partial t} = 0$, we apply separation of variables: $\\psi(x,t) = \\phi(x) T(t)$.

This yields the **Time-Independent Schrödinger Equation**:

$$\\hat{H} \\phi_n(x) = E_n \\phi_n(x)$$

The general time-dependent solution is a linear superposition of energy eigenstates:

$$\\psi(x,t) = \\sum_{n=1}^{\\infty} c_n \\phi_n(x) \\exp\\left(-\\frac{i E_n t}{\\hbar}\\right)$$

Where the Fourier coefficients are given by the inner product projection:

$$c_n = \\langle \\phi_n | \\psi(0) \\rangle = \\int_{-\\infty}^{\\infty} \\phi_n^*(x) \\psi(x,0) \\, dx$$

---

### 3. Probability Density & Flux Conservation

The local probability density $\\rho(x,t) = |\\psi(x,t)|^2$ satisfies the exact continuity equation:

$$\\frac{\\partial \\rho}{\\partial t} + \\nabla \\cdot \\mathbf{J} = 0$$

Where the quantum probability flux $\\mathbf{J}$ is:

$$\\mathbf{J} = \\frac{\\hbar}{2mi} \\left( \\psi^* \\nabla \\psi - \\psi \\nabla \\psi^* \\right) = \\frac{1}{m} \\operatorname{Re}\\left( \\psi^* \\hat{\\mathbf{p}} \\psi \\right)$$
`,
      steps: [
        {
          stepNumber: 1,
          title: "Hamiltonian Operator Assembly",
          explanation: "Express canonical kinetic energy $\\hat{T} = \\frac{\\hat{p}^2}{2m}$ and coordinate potential $V(\\hat{x})$ to form the total self-adjoint energy operator $\\hat{H}$.",
          formula: "\\hat{H} = -\\frac{\\hbar^2}{2m}\\frac{d^2}{dx^2} + V(x)",
          intuition: "Curvature in the spatial wave corresponds to kinetic momentum."
        },
        {
          stepNumber: 2,
          title: "Unitary Propagator Formulation",
          explanation: "Integrate the first-order differential operator equation by matrix exponentiation into propagator $\\hat{U}(t)$.",
          formula: "\\hat{U}(t) = \\exp\\left( -\\frac{i\\hat{H}t}{\\hbar} \\right)",
          intuition: "Rotates state vectors in Hilbert space without changing their norm."
        },
        {
          stepNumber: 3,
          title: "Eigenbasis Expansion & Phase Velocity",
          explanation: "Project initial boundary wave packet $|\\psi(0)\\rangle$ onto complete orthonormal eigenstate set $\\{\\phi_n\\}$.",
          formula: "|\\psi(t)\\rangle = \\sum_n c_n e^{-i E_n t / \\hbar} |\\phi_n\\rangle",
          intuition: "Each harmonic mode rotates with frequency $\\omega_n = E_n / \\hbar$."
        },
        {
          stepNumber: 4,
          title: "Continuity & Probability Flux",
          explanation: "Take the time derivative of $\\rho = \\psi^*\\psi$ and substitute the Schrödinger equation to isolate the divergence of flux $\\mathbf{J}$.",
          formula: "\\frac{\\partial |\\psi|^2}{\\partial t} + \\nabla \\cdot \\mathbf{J} = 0",
          intuition: "Guarantees that particles cannot spontaneously vanish or multiply."
        }
      ],
      flashcards: [
        {
          id: "qm-fc1",
          question: "What is the physical requirement for a quantum operator to be an observable?",
          answer: "The operator must be Hermitian (self-adjoint: $\\hat{A}^\\dagger = \\hat{A}$), guaranteeing real eigenvalues and an orthonormal basis.",
          topic: "Operator Theory"
        },
        {
          id: "qm-fc2",
          question: "Write down the probability current density $\\mathbf{J}$ formula.",
          answer: "$\\mathbf{J} = \\frac{\\hbar}{2mi} (\\psi^* \\nabla \\psi - \\psi \\nabla \\psi^*)$",
          topic: "Continuity"
        },
        {
          id: "qm-fc3",
          question: "Why do expectation values $\\langle \\hat{H} \\rangle$ remain constant in time for isolated systems?",
          answer: "Because $[\\hat{H}, \\hat{H}] = 0$ and $\\frac{\\partial \\hat{H}}{\\partial t} = 0$, making $\\frac{d}{dt}\\langle \\hat{H} \\rangle = 0$ by Ehrenfest's Theorem.",
          topic: "Conservation Laws"
        }
      ],
      keyFormulas: [
        "i\\hbar \\frac{\\partial}{\\partial t} |\\psi\\rangle = \\hat{H} |\\psi\\rangle",
        "\\mathbf{J} = \\frac{\\hbar}{2mi}(\\psi^* \\nabla \\psi - \\psi \\nabla \\psi^*)",
        "\\hat{U}(t) = \\exp(-i\\hat{H}t/\\hbar)"
      ],
      suggestedQuestions: [
        "How does quantum tunneling occur through a finite potential barrier?",
        "Can you derive the Heisenberg uncertainty relation from this wave equation?",
        "What happens when the potential $V(x,t)$ is explicitly time-dependent?"
      ]
    }
  },
  {
    id: "neural-backpropagation",
    title: "Deep Neural Networks: Backpropagation & Jacobians",
    topic: "Machine Learning & Optimization",
    category: "Computer Science / AI",
    thumbnailSvg: createChalkboardSvg(
      "Backpropagation & Tensor Jacobians",
      [
        "1. z^[l] = W^[l] a^[l-1] + b^[l]",
        "2. a^[l] = σ(z^[l])",
        "3. L = -Σ y_k log(a_k^[L])   [Cross Entropy]",
        "4. δ^[L] = ∇_a L ⊙ σ'(z^[L]) = a^[L] - y",
        "5. δ^[l] = ((W^[l+1])^T δ^[l+1]) ⊙ σ'(z^[l])",
        "6. ∂L/∂W^[l] = δ^[l] (a^[l-1])^T,  ∂L/∂b^[l] = δ^[l]"
      ],
      "#a855f7"
    ),
    presetAnalysis: {
      courseCode: "CS420",
      courseName: "Deep Neural Networks & Machine Learning",
      topicTitle: "Matrix Calculus & Vectorized Backpropagation in Deep Networks",
      summary: "Complete mathematical derivation of error gradients via the multivariate chain rule, matrix Jacobians, and gradient tensor accumulation across multilayer perceptrons.",
      structuredNotes: `### 1. Forward Propagation Formulations

For layer $l \\in \\{1, \\dots, L\\}$, given activation vector $\\mathbf{a}^{[l-1]} \\in \\mathbb{R}^{n_{l-1}}$:

$$\\mathbf{z}^{[l]} = \\mathbf{W}^{[l]} \\mathbf{a}^{[l-1]} + \\mathbf{b}^{[l]}$$
$$\\mathbf{a}^{[l]} = \\sigma\\left( \\mathbf{z}^{[l]} \\right)$$

Where:
- $\\mathbf{W}^{[l]} \\in \\mathbb{R}^{n_l \\times n_{l-1}}$ is the weight parameter matrix
- $\\mathbf{b}^{[l]} \\in \\mathbb{R}^{n_l}$ is the bias vector
- $\\sigma(\\cdot)$ is an element-wise non-linear activation function (e.g., GELU, Swish, ReLU)

---

### 2. Loss Objective & Output Error Vector $\\boldsymbol{\\delta}^{[L]}$

Under Categorical Cross-Entropy loss with Softmax output $\\hat{\\mathbf{y}} = \\mathbf{a}^{[L]}$:

$$\\mathcal{L}(\\mathbf{y}, \\hat{\\mathbf{y}}) = -\\sum_{k=1}^K y_k \\log\\left( a_k^{[L]} \\right)$$

The error gradient vector $\\boldsymbol{\\delta}^{[L]} = \\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{z}^{[L]}}$ simplifies elegantly to:

$$\\boldsymbol{\\delta}^{[L]} = \\mathbf{a}^{[L]} - \\mathbf{y}$$

---

### 3. Recurrence Relation for Hidden Layers

Using the multivariate chain rule, the error vector $\\boldsymbol{\\delta}^{[l]}$ is propagated backwards through the transposed weight matrices:

$$\\boldsymbol{\\delta}^{[l]} = \\left( (\\mathbf{W}^{[l+1]})^T \\boldsymbol{\\delta}^{[l+1]} \\right) \\odot \\sigma'\\left( \\mathbf{z}^{[l]} \\right)$$

Where $\\odot$ represents the Hadamard (element-wise) product.

Parameter gradient updates:

$$\\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{W}^{[l]}} = \\boldsymbol{\\delta}^{[l]} (\\mathbf{a}^{[l-1]})^T, \\qquad \\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{b}^{[l]}} = \\boldsymbol{\\delta}^{[l]}$$
`,
      steps: [
        {
          stepNumber: 1,
          title: "Output Layer Jacobian Computation",
          explanation: "Compute the derivative of the cross-entropy objective with respect to the pre-activation logit vector $\\mathbf{z}^{[L]}$.",
          formula: "\\boldsymbol{\\delta}^{[L]} = \\mathbf{a}^{[L]} - \\mathbf{y}",
          intuition: "Direct difference between network prediction and true one-hot ground truth."
        },
        {
          stepNumber: 2,
          title: "Backward Error Sensitivity Flow",
          explanation: "Multiply downstream error by transposed weight matrix to push gradients back to earlier hidden representations.",
          formula: "\\boldsymbol{\\delta}^{[l]} = ((\\mathbf{W}^{[l+1]})^T \\boldsymbol{\\delta}^{[l+1]}) \\odot \\sigma'(\\mathbf{z}^{[l]})",
          intuition: "Distributes blame proportionally to each neuron's outgoing synaptic strength."
        },
        {
          stepNumber: 3,
          title: "Parameter Outer Product Gradients",
          explanation: "Calculate outer product between error sensitivity vector and incoming activations.",
          formula: "\\nabla_{\\mathbf{W}^{[l]}} \\mathcal{L} = \\boldsymbol{\\delta}^{[l]} (\\mathbf{a}^{[l-1]})^T",
          intuition: "Synaptic weights are adjusted most when both error signal and incoming signal are large."
        }
      ],
      flashcards: [
        {
          id: "nn-fc1",
          question: "Why is the transpose $(W^{[l+1]})^T$ used during backprop?",
          answer: "To reverse the linear mapping dimension from layer $l+1$ back to dimension of layer $l$, satisfying tensor dimensions.",
          topic: "Matrix Calculus"
        },
        {
          id: "nn-fc2",
          question: "What causes the vanishing gradient problem in deep networks?",
          answer: "Repeated multiplication of terms $|\\sigma'(z)| < 1$ (e.g. sigmoid max derivative is $0.25$) causing $\\delta^{[1]} \\to 0$ exponentially.",
          topic: "Optimization"
        }
      ],
      keyFormulas: [
        "\\boldsymbol{\\delta}^{[l]} = ((\\mathbf{W}^{[l+1]})^T \\boldsymbol{\\delta}^{[l+1]}) \\odot \\sigma'(\\mathbf{z}^{[l]})",
        "\\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{W}^{[l]}} = \\boldsymbol{\\delta}^{[l]} (\\mathbf{a}^{[l-1]})^T"
      ],
      suggestedQuestions: [
        "How do residual skip connections ($x + F(x)$) resolve vanishing gradient issues in ResNets?",
        "How does Adam optimizer compute second-moment bias-corrected updates?"
      ]
    }
  },
  {
    id: "fourier-transforms",
    title: "Multidimensional Fourier Transform & Signal Spectra",
    topic: "Applied Mathematics & Signal Analysis",
    category: "Mathematics / Analysis",
    thumbnailSvg: createChalkboardSvg(
      "Continuous & Discrete Fourier Analysis",
      [
        "1. F(ω) = ∫_{-∞}^{∞} f(t) e^{-iωt} dt",
        "2. f(t) = (1/2π) ∫_{-∞}^{∞} F(ω) e^{iωt} dω",
        "3. F{f * g} = F(ω) · G(ω)   [Convolution Theorem]",
        "4. ∫ |f(t)|² dt = (1/2π) ∫ |F(ω)|² dω  [Plancherel]",
        "5. F{dⁿf/dtⁿ} = (iω)ⁿ F(ω)",
        "6. X[k] = Σ_{n=0}^{N-1} x[n] exp(-i2πkn/N)"
      ],
      "#10b981"
    ),
    presetAnalysis: {
      courseCode: "MATH310",
      courseName: "Fourier Systems & Signal Analysis",
      topicTitle: "Continuous Fourier Transforms, Convolution & Plancherel Isometry",
      summary: "Theoretical breakdown of Fourier operator mappings between temporal and spectral domains, the Convolution Theorem, and spectral differentiation properties.",
      structuredNotes: `### 1. Forward and Inverse Fourier Transforms

For any integrable function $f \\in L^1(\\mathbb{R}) \\cap L^2(\\mathbb{R})$, the continuous Fourier transform $\\mathcal{F}\\{f\\} = F(\\omega)$ is defined as:

$$F(\\omega) = \\int_{-\\infty}^{\\infty} f(t) e^{-i \\omega t} \\, dt$$

The synthesis reconstruction is given by the inverse Fourier integral:

$$f(t) = \\frac{1}{2\\pi} \\int_{-\\infty}^{\\infty} F(\\omega) e^{i \\omega t} \\, d\\omega$$

---

### 2. Convolution Theorem & Spectral Duality

Convolution in the time domain corresponds directly to pointwise algebraic multiplication in the frequency domain:

$$\\mathcal{F}\\{f * g\\}(\\omega) = F(\\omega) \\cdot G(\\omega)$$

Where the continuous convolution is defined as:

$$(f * g)(t) = \\int_{-\\infty}^{\\infty} f(\\tau) g(t - \\tau) \\, d\\tau$$

---

### 3. Plancherel / Parseval Isometry

The $L^2$ energy is conserved across domains:

$$\\int_{-\\infty}^{\\infty} |f(t)|^2 \\, dt = \\frac{1}{2\\pi} \\int_{-\\infty}^{\\infty} |F(\\omega)|^2 \\, d\\omega$$

Demonstrating that the Fourier transform scaled by $\\frac{1}{\\sqrt{2\\pi}}$ is a unitary operator on $L^2(\\mathbb{R})$.
`,
      steps: [
        {
          stepNumber: 1,
          title: "Complex Exponential Decomposition",
          explanation: "Express the temporal signal as a continuous projection onto orthogonal complex sinusoids $e^{-i\\omega t}$.",
          formula: "F(\\omega) = \\int_{-\\infty}^\\infty f(t) e^{-i\\omega t} dt",
          intuition: "Computes the resonance correlation between the signal and frequency $\\omega$."
        },
        {
          stepNumber: 2,
          title: "Convolution Frequency Invariance",
          explanation: "Apply Fubini's theorem to swap order of integration in the double convolution integral.",
          formula: "\\mathcal{F}\\{f * g\\} = F(\\omega) G(\\omega)",
          intuition: "Bypasses costly $O(N^2)$ time-domain convolutions into fast $O(N)$ spectral products."
        }
      ],
      flashcards: [
        {
          id: "ft-fc1",
          question: "What is the Fourier transform of a Gaussian $f(t) = e^{-a t^2}$?",
          answer: "$F(\\omega) = \\sqrt{\\frac{\\pi}{a}} e^{-\\omega^2 / (4a)}$, another Gaussian in frequency space.",
          topic: "Fourier Transforms"
        }
      ],
      keyFormulas: [
        "F(\\omega) = \\int_{-\\infty}^\\infty f(t) e^{-i\\omega t} dt",
        "\\mathcal{F}\\{f * g\\} = F(\\omega) G(\\omega)"
      ],
      suggestedQuestions: [
        "How is the Fast Fourier Transform (FFT) implemented in $O(N \\log N)$ using the Cooley-Tukey butterfly algorithm?",
        "What is the Nyquist-Shannon sampling theorem condition for bandlimited signals?"
      ]
    }
  }
];

export const sampleBoards = SAMPLE_BOARDS;
