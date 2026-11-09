import { CampusMateState, CourseDetail } from '../types';

export const MAJU_COURSES_DATA: CourseDetail[] = [
  {
    code: 'CS 1101',
    name: 'Programming Fundamentals',
    creditHours: '3 + 1 Cr. Hrs (Theory + Lab)',
    instructor: 'Engr. Muhammad Ali / Lab Engr. Hamza Khan',
    room: 'Block B - Room 302 / Computing Lab 2',
    schedule: 'Mon (09:00 - 10:30), Wed Lab (11:30 - 14:30)',
    description: 'Foundational computer programming principles using C++, focusing on problem solving, algorithmic thinking, control flow, functions, arrays, pointers, and memory management.',
    color: 'blue',
    syllabusTopics: [
      'Problem Solving & Algorithm Design Flowcharts',
      'C++ Primitive Data Types, Operators & Expressions',
      'Conditional Branching: if-else and switch-case',
      'Iterative Constructs: for, while, and do-while loops',
      'Modular Programming: User-defined functions & scope',
      'Arrays: 1D, 2D Arrays & C-Strings',
      'Pointers & Memory Addresses',
      'Dynamic Memory Allocation using new and delete'
    ]
  },
  {
    code: 'MT 1001',
    name: 'Calculus & Analytical Geometry',
    creditHours: '3 + 0 Cr. Hrs (Theory)',
    instructor: 'Dr. Tariq Mahmood',
    room: 'Block A - Room 405 (Main Campus)',
    schedule: 'Mon (11:00 - 12:30), Thu (09:00 - 10:30)',
    description: 'Rigorous study of limits, continuity, differential calculus, applications of derivatives to optimization, curve sketching, and introduction to integration.',
    color: 'indigo',
    syllabusTopics: [
      'Real Numbers, Coordinate Systems & Inequalities',
      'Limits, Continuity and Sandwich Theorem',
      'Techniques of Differentiation (Product, Quotient, Chain Rule)',
      'Implicit Differentiation & Higher-Order Derivatives',
      'Applications of Derivatives: Maxima, Minima & Rates of Change',
      'Mean Value Theorem & L’Hôpital’s Rule for Indeterminate Forms',
      'Introduction to Anti-derivatives & Definite Integrals'
    ]
  },
  {
    code: 'CS 1002',
    name: 'Information & Communication Tech (ICT)',
    creditHours: '2 + 1 Cr. Hrs (Theory + Lab)',
    instructor: 'Prof. Sana Fatima',
    room: 'Block B - Room 201 / IT Hardware Lab',
    schedule: 'Tue (10:00 - 11:30), Fri Lab (09:00 - 10:30)',
    description: 'Comprehensive overview of computer architecture, modern operating systems, computer networks, internet protocols, cloud computing, database basics, and cybersecurity.',
    color: 'sky',
    syllabusTopics: [
      'Computer Systems & Hardware Architecture',
      'CPU, Memory Hierarchy, Bus Systems & Storage',
      'Operating System Principles & Process Management',
      'Computer Networks: LAN, WAN, Topologies & Devices',
      'OSI 7-Layer Reference Model & TCP/IP Stack',
      'Internet Protocols, DNS & Web Hosting Architecture',
      'Cybersecurity Fundamentals, Encryption & Safe Practices'
    ]
  },
  {
    code: 'HU 1001',
    name: 'Functional English',
    creditHours: '3 + 0 Cr. Hrs (Theory)',
    instructor: 'Ms. Ayesha Siddiqui',
    room: 'Humanities Hall - Room 104',
    schedule: 'Tue (12:00 - 13:30), Thu (11:00 - 12:30)',
    description: 'Developing English linguistic and communicative competencies, academic writing skills, précis composition, critical reading comprehension, and oral presentation proficiency.',
    color: 'teal',
    syllabusTopics: [
      'Grammar in Context: Subject-Verb Agreement & Tense Usage',
      'Vocabulary Expansion & Academic Collocations',
      'Paragraph Writing: The PEEL & Topic Sentence Structure',
      'Précis Writing Rules & Text Summarization',
      'Critical Reading Comprehension & Inference',
      'Argumentative & Expository Essay Drafting',
      'Professional Academic Presentation Delivery'
    ]
  },
  {
    code: 'HU 1002',
    name: 'Ethics & Professional Conduct',
    creditHours: '2 + 0 Cr. Hrs (Theory)',
    instructor: 'Dr. Abdul Rehman',
    room: 'Block A - Room 304',
    schedule: 'Wed (09:00 - 10:30), Fri (11:00 - 12:30)',
    description: 'Philosophical, societal, and professional ethics with specialized emphasis on computer science, intellectual property, data privacy, and the ACM/IEEE code of ethics.',
    color: 'violet',
    syllabusTopics: [
      'Introduction to Moral Philosophy & Applied Ethics',
      'Normative Theories: Virtue Ethics, Utilitarianism, Deontology',
      'Professional Responsibility in Engineering & Computing',
      'ACM / IEEE Code of Ethics & Professional Practice',
      'Privacy, Surveillance & Personal Data Protection',
      'Intellectual Property, Copyright, Patents & Open Source',
      'Whistleblowing & Corporate Accountability Case Studies'
    ]
  }
];

export const initialData: CampusMateState = {
  profile: {
    name: 'Esha Meghani',
    major: 'BS Computer Science (BSCS)',
    university: 'Mohammad Ali Jinnah University (MAJU), Karachi',
    semester: 'Fall Semester 2026',
    gpa: 3.85,
    targetGpa: 3.92,
    avatarUrl: '/src/assets/images/campus_student_avatar_1794130097197.jpg'
  },
  weeklyStudyGoalHours: 22,
  assignments: [
    {
      id: 'asg-1',
      title: 'Pointers & Dynamic Memory Allocation in C++',
      courseCode: 'CS 1101',
      courseName: 'Programming Fundamentals',
      dueDate: '2026-11-12T23:59',
      status: 'in_progress',
      priority: 'high',
      weightPercentage: 15,
      description: 'Implement dynamic array resizing, pointer arithmetic, and prevent memory leaks using valgrind tests.'
    },
    {
      id: 'asg-2',
      title: 'Limits, Continuity & Derivative Theorems Problem Set',
      courseCode: 'MT 1001',
      courseName: 'Calculus & Analytical Geometry',
      dueDate: '2026-11-16T23:59',
      status: 'not_started',
      priority: 'high',
      weightPercentage: 12,
      description: 'Solve questions 15 to 30 on epsilon-delta definition, chain rule proofs, and implicit differentiation.'
    },
    {
      id: 'asg-3',
      title: 'Network Topologies & Cloud Architecture Report',
      courseCode: 'CS 1002',
      courseName: 'Information & Communication Technologies (ICT)',
      dueDate: '2026-11-19T18:00',
      status: 'in_progress',
      priority: 'medium',
      weightPercentage: 10,
      description: 'Comparative case study of Star, Mesh, and Hybrid network topographies with subnetting design.'
    },
    {
      id: 'asg-4',
      title: 'Academic Essay: Tech Innovation in Pakistan',
      courseCode: 'HU 1001',
      courseName: 'Functional English',
      dueDate: '2026-11-23T17:00',
      status: 'not_started',
      priority: 'medium',
      weightPercentage: 10,
      description: 'Write a 1200-word structured argumentative essay following APA 7th referencing conventions.'
    },
    {
      id: 'asg-5',
      title: 'Case Study: AI Ethics & Professional Integrity',
      courseCode: 'HU 1002',
      courseName: 'Ethics & Professional Conduct',
      dueDate: '2026-11-26T23:59',
      status: 'not_started',
      priority: 'medium',
      weightPercentage: 8,
      description: 'Analyze real-world data privacy breaches from utilitarian and deontological ethical frameworks.'
    },
    {
      id: 'asg-6',
      title: 'Flowcharting & Algorithm Pseudocode Lab Report',
      courseCode: 'CS 1101',
      courseName: 'Programming Fundamentals',
      dueDate: '2026-11-05T23:59',
      status: 'graded',
      priority: 'medium',
      weightPercentage: 10,
      grade: '98%'
    }
  ],
  classes: [
    {
      id: 'cls-1',
      courseCode: 'CS 1101',
      courseName: 'Programming Fundamentals (Theory)',
      day: 'Monday',
      startTime: '08:30',
      endTime: '10:00',
      location: 'Block B - Room 302 (PECHS Campus)',
      instructor: 'Engr. Muhammad Ali',
      color: 'blue',
      type: 'Lecture'
    },
    {
      id: 'cls-2',
      courseCode: 'MT 1001',
      courseName: 'Calculus & Analytical Geometry',
      day: 'Monday',
      startTime: '10:15',
      endTime: '11:45',
      location: 'Block A - Room 405 (Main Campus)',
      instructor: 'Dr. Tariq Mahmood',
      color: 'indigo',
      type: 'Lecture'
    },
    {
      id: 'cls-3',
      courseCode: 'CS 1002',
      courseName: 'Information & Communication Tech (ICT)',
      day: 'Tuesday',
      startTime: '10:00',
      endTime: '11:30',
      location: 'Block B - Room 201',
      instructor: 'Prof. Sana Fatima',
      color: 'sky',
      type: 'Lecture'
    },
    {
      id: 'cls-4',
      courseCode: 'HU 1001',
      courseName: 'Functional English',
      day: 'Tuesday',
      startTime: '12:00',
      endTime: '13:30',
      location: 'Humanities Hall - Room 104',
      instructor: 'Ms. Ayesha Siddiqui',
      color: 'teal',
      type: 'Seminar'
    },
    {
      id: 'cls-5',
      courseCode: 'HU 1002',
      courseName: 'Ethics & Professional Conduct',
      day: 'Wednesday',
      startTime: '09:00',
      endTime: '10:30',
      location: 'Block A - Room 304',
      instructor: 'Dr. Abdul Rehman',
      color: 'violet',
      type: 'Lecture'
    },
    {
      id: 'cls-6',
      courseCode: 'CS 1101',
      courseName: 'Programming Fundamentals Lab',
      day: 'Wednesday',
      startTime: '11:30',
      endTime: '14:30',
      location: 'CS Computing Lab 2 (PECHS)',
      instructor: 'Lab Engr. Hamza Khan',
      color: 'blue',
      type: 'Lab'
    },
    {
      id: 'cls-7',
      courseCode: 'MT 1001',
      courseName: 'Calculus Problem Session',
      day: 'Thursday',
      startTime: '09:00',
      endTime: '10:30',
      location: 'Block A - Room 405',
      instructor: 'Dr. Tariq Mahmood',
      color: 'indigo',
      type: 'Tutorial'
    },
    {
      id: 'cls-8',
      courseCode: 'HU 1001',
      courseName: 'Functional English Workshop',
      day: 'Thursday',
      startTime: '11:00',
      endTime: '12:30',
      location: 'Humanities Hall - Room 104',
      instructor: 'Ms. Ayesha Siddiqui',
      color: 'teal',
      type: 'Seminar'
    },
    {
      id: 'cls-9',
      courseCode: 'CS 1002',
      courseName: 'ICT Hardware & Networking Lab',
      day: 'Friday',
      startTime: '09:00',
      endTime: '10:30',
      location: 'IT Lab 1 (Main Campus)',
      instructor: 'Prof. Sana Fatima',
      color: 'sky',
      type: 'Lab'
    },
    {
      id: 'cls-10',
      courseCode: 'HU 1002',
      courseName: 'Ethics Seminar & Discussion',
      day: 'Friday',
      startTime: '11:00',
      endTime: '12:30',
      location: 'Block A - Room 304',
      instructor: 'Dr. Abdul Rehman',
      color: 'violet',
      type: 'Seminar'
    }
  ],
  exams: [
    {
      id: 'ex-1',
      courseCode: 'CS 1101',
      courseName: 'Programming Fundamentals Midterm Exam',
      examDate: '2026-11-18T09:00',
      location: 'MAJU Main Campus - Examination Hall B',
      seatNumber: 'Seat B-24',
      weightPercentage: 25,
      notes: 'No electronic gadgets. 2 blue/black ballpoints required. Covers C++ syntax, loops, arrays & functions.',
      topics: [
        { id: 't-1', text: 'Data types, operators, and control flow structures (if-else, switch)', completed: true },
        { id: 't-2', text: 'Looping constructs (for, while, do-while) and nested logic', completed: true },
        { id: 't-3', text: 'Functions, parameter passing (by value vs by reference)', completed: true },
        { id: 't-4', text: '1D & 2D Arrays and string manipulation', completed: false },
        { id: 't-5', text: 'Pointers, memory addresses, and dynamic allocation (new/delete)', completed: false }
      ]
    },
    {
      id: 'ex-2',
      courseCode: 'MT 1001',
      courseName: 'Calculus & Analytical Geometry Midterm',
      examDate: '2026-11-22T11:00',
      location: 'Block A - Examination Room 405',
      seatNumber: 'Seat A-12',
      weightPercentage: 25,
      notes: 'Scientific calculator allowed (non-programmable). Formulas provided on front sheet.',
      topics: [
        { id: 't-6', text: 'Limits and continuity (sandwich theorem, infinite limits)', completed: true },
        { id: 't-7', text: 'Derivatives using definition and power/product/quotient rules', completed: true },
        { id: 't-8', text: 'Chain rule, implicit differentiation, and higher derivatives', completed: false },
        { id: 't-9', text: 'Applications of derivatives: maxima, minima, and curve sketching', completed: false }
      ]
    },
    {
      id: 'ex-3',
      courseCode: 'CS 1002',
      courseName: 'Information & Communication Tech (ICT) Midterm',
      examDate: '2026-11-25T14:00',
      location: 'Main Auditorium - Section C',
      seatNumber: 'Seat C-08',
      weightPercentage: 20,
      notes: 'MCQs and descriptive questions on computer architecture and networking.',
      topics: [
        { id: 't-10', text: 'Computer hardware architecture (CPU, memory hierarchy, bus systems)', completed: true },
        { id: 't-11', text: 'Operating system functions and process management', completed: false },
        { id: 't-12', text: 'Computer networks: OSI reference model and TCP/IP protocol suite', completed: false },
        { id: 't-13', text: 'Internet technologies, cloud computing, and cybersecurity fundamentals', completed: false }
      ]
    },
    {
      id: 'ex-4',
      courseCode: 'HU 1001',
      courseName: 'Functional English Midterm Examination',
      examDate: '2026-11-28T10:00',
      location: 'Block B - Room 201',
      seatNumber: 'Seat D-15',
      weightPercentage: 20,
      notes: 'Includes reading comprehension, précis writing, and vocabulary analysis.',
      topics: [
        { id: 't-14', text: 'Grammar review: subject-verb agreement and tense consistency', completed: true },
        { id: 't-15', text: 'Précis writing rules and paragraph summarization', completed: false },
        { id: 't-16', text: 'Vocabulary expansion and context clue identification', completed: false }
      ]
    },
    {
      id: 'ex-5',
      courseCode: 'HU 1002',
      courseName: 'Ethics & Professional Conduct Midterm',
      examDate: '2026-12-02T09:30',
      location: 'Block A - Room 304',
      seatNumber: 'Seat E-03',
      weightPercentage: 20,
      notes: 'Case study analysis and ethical theory application.',
      topics: [
        { id: 't-17', text: 'Classical ethical philosophies (Virtue Ethics, Utilitarianism, Deontology)', completed: true },
        { id: 't-18', text: 'Professional codes of conduct (IEEE / ACM Code of Ethics)', completed: false },
        { id: 't-19', text: 'Intellectual property rights and software licensing ethics', completed: false }
      ]
    }
  ],
  quizResults: [
    {
      id: 'qz-1',
      courseCode: 'CS 1101',
      title: 'Quiz 1: Data Types, Operators & If-Else Branching',
      type: 'Quiz',
      obtainedMarks: 9.5,
      totalMarks: 10,
      weightPercentage: 5,
      date: '2026-10-15',
      remarks: 'Excellent execution on nested condition logic'
    },
    {
      id: 'qz-2',
      courseCode: 'CS 1101',
      title: 'Quiz 2: Loops, Iterations & Function Pass-by-Reference',
      type: 'Quiz',
      obtainedMarks: 9,
      totalMarks: 10,
      weightPercentage: 5,
      date: '2026-10-28',
      remarks: 'Minor off-by-one boundary check'
    },
    {
      id: 'qz-3',
      courseCode: 'CS 1101',
      title: 'Lab Evaluation 1: Dynamic Arrays & Pointer Memory Management',
      type: 'Lab Task',
      obtainedMarks: 10,
      totalMarks: 10,
      weightPercentage: 5,
      date: '2026-11-04',
      remarks: 'Zero memory leaks, clean destructor calls'
    },
    {
      id: 'qz-4',
      courseCode: 'MT 1001',
      title: 'Quiz 1: Limits & Epsilon-Delta Rigorous Proofs',
      type: 'Quiz',
      obtainedMarks: 8.5,
      totalMarks: 10,
      weightPercentage: 5,
      date: '2026-10-18',
      remarks: 'Well-reasoned delta choice for quadratic limit'
    },
    {
      id: 'qz-5',
      courseCode: 'MT 1001',
      title: 'Quiz 2: Product & Quotient Differentiation Rules',
      type: 'Quiz',
      obtainedMarks: 9,
      totalMarks: 10,
      weightPercentage: 5,
      date: '2026-11-02',
      remarks: 'Accurate trigonometric derivative expansions'
    },
    {
      id: 'qz-6',
      courseCode: 'CS 1002',
      title: 'Quiz 1: CPU Architecture & Memory Hierarchy Levels',
      type: 'Quiz',
      obtainedMarks: 10,
      totalMarks: 10,
      weightPercentage: 5,
      date: '2026-10-20',
      remarks: 'Perfect score on cache hit/miss latency'
    },
    {
      id: 'qz-7',
      courseCode: 'CS 1002',
      title: 'Lab Task 1: Subnetting & IP Addressing Mask Calculation',
      type: 'Lab Task',
      obtainedMarks: 9.5,
      totalMarks: 10,
      weightPercentage: 5,
      date: '2026-10-27',
      remarks: 'Correct CIDR /26 broadcast calculation'
    },
    {
      id: 'qz-8',
      courseCode: 'HU 1001',
      title: 'Quiz 1: Subject-Verb Concord & Academic Transition Words',
      type: 'Quiz',
      obtainedMarks: 8.5,
      totalMarks: 10,
      weightPercentage: 5,
      date: '2026-10-22',
      remarks: 'Strong vocabulary usage'
    },
    {
      id: 'qz-9',
      courseCode: 'HU 1001',
      title: 'Précis Writing Evaluation 1: Tech Essay Summary',
      type: 'Assignment',
      obtainedMarks: 18.5,
      totalMarks: 20,
      weightPercentage: 10,
      date: '2026-11-01',
      remarks: 'Clear title and tight one-third word limit adherence'
    },
    {
      id: 'qz-10',
      courseCode: 'HU 1002',
      title: 'Quiz 1: Deontological vs Utilitarian Frameworks',
      type: 'Quiz',
      obtainedMarks: 9,
      totalMarks: 10,
      weightPercentage: 5,
      date: '2026-10-24',
      remarks: 'Very clear Kantian categorical imperative example'
    }
  ],
  notes: [
    {
      id: 'note-1',
      title: 'CS 1101: Pointer Arithmetic & Dynamic Memory in C++',
      courseCode: 'CS 1101',
      pinned: true,
      updatedAt: '2026-11-07T16:20',
      tags: ['C++', 'Pointers', 'ProgrammingFundamentals', 'MAJU'],
      content: `### Pointer Essentials in C++
- A pointer stores the memory address of another variable.
- Declaration: \`int* ptr = &val;\`
- Dereferencing: \`*ptr\` yields the value stored at that address.

### Dynamic Memory Allocation (Heap vs Stack)
- Allocate: \`int* arr = new int[size];\`
- ALWAYS deallocate to prevent memory leak: \`delete[] arr;\`
- Set pointer to \`nullptr\` after deletion: \`arr = nullptr;\`

### Pointer vs Reference
- References cannot be null and cannot be reseated after initialization.
- Pointers can be null, reassigned, and used for dynamic structures.`
    },
    {
      id: 'note-2',
      title: 'MT 1001: Calculus Differentiation Rules & Cheatsheet',
      courseCode: 'MT 1001',
      pinned: true,
      updatedAt: '2026-11-06T18:00',
      tags: ['Calculus', 'Derivatives', 'Formulas'],
      content: `### Core Differentiation Rules
1. **Product Rule:** \`d/dx [f(x) * g(x)] = f'(x)g(x) + f(x)g'(x)\`
2. **Quotient Rule:** \`d/dx [f(x) / g(x)] = [f'(x)g(x) - f(x)g'(x)] / [g(x)]^2\`
3. **Chain Rule:** \`d/dx [f(g(x))] = f'(g(x)) * g'(x)\`

### Key Trigonometric Derivatives
- \`d/dx [sin(x)] = cos(x)\`
- \`d/dx [cos(x)] = -sin(x)\`
- \`d/dx [tan(x)] = sec^2(x)\``
    },
    {
      id: 'note-3',
      title: 'CS 1002: OSI 7-Layer Reference Model Summary',
      courseCode: 'CS 1002',
      pinned: false,
      updatedAt: '2026-11-05T12:30',
      tags: ['ICT', 'Networking', 'OSI'],
      content: `### 7 Layers of OSI Model (Top to Bottom)
1. **Application Layer (L7):** HTTP, HTTPS, FTP, DNS (User interfaces)
2. **Presentation Layer (L6):** Data encryption, formatting, compression (SSL/TLS)
3. **Session Layer (L5):** Establishes, manages, and terminates sessions
4. **Transport Layer (L4):** End-to-end transport, TCP (reliable) / UDP (fast)
5. **Network Layer (L3):** Routing and logical addressing (IP addresses, Routers)
6. **Data Link Layer (L2):** Framing, physical addressing (MAC addresses, Switches)
7. **Physical Layer (L1):** Raw bit transmission over physical media (Cables, Hubs)`
    },
    {
      id: 'note-4',
      title: 'HU 1001: Academic Essay Paragraph Structure (PEEL)',
      courseCode: 'HU 1001',
      pinned: false,
      updatedAt: '2026-11-04T14:15',
      tags: ['FunctionalEnglish', 'Writing', 'PEEL'],
      content: `### PEEL Writing Method
- **Point:** State your topic sentence clearly in the first sentence.
- **Evidence / Explanation:** Provide data, citations, or logical proof.
- **Elaboration:** Explain why this evidence matters to your thesis.
- **Link:** Conclude the paragraph and transition seamlessly to the next point.`
    },
    {
      id: 'note-5',
      title: 'HU 1002: IEEE Code of Ethics for Software Engineers',
      courseCode: 'HU 1002',
      pinned: false,
      updatedAt: '2026-11-03T10:00',
      tags: ['Ethics', 'ACM', 'IEEE', 'Professionalism'],
      content: `### Key Principles of ACM/IEEE Code
1. **Public:** Act consistently with the public interest and safety.
2. **Client & Employer:** Act in the best interest of client and employer, consistent with public good.
3. **Product:** Ensure software and related modifications meet the highest professional standards.
4. **Judgment:** Maintain integrity and independence in professional judgment.`
    }
  ],
  todos: [
    {
      id: 'td-1',
      title: 'Practice C++ pointer arithmetic problems 5 to 12 for PF lab',
      completed: false,
      priority: 'high',
      dueDate: '2026-11-09',
      estimatedMinutes: 60,
      category: 'Academic'
    },
    {
      id: 'td-2',
      title: 'Solve Calculus problem set exercises on implicit differentiation',
      completed: false,
      priority: 'high',
      dueDate: '2026-11-10',
      estimatedMinutes: 45,
      category: 'Academic'
    },
    {
      id: 'td-3',
      title: 'Read ICT chapter on TCP vs UDP protocols before Tuesday class',
      completed: true,
      priority: 'medium',
      dueDate: '2026-11-08',
      estimatedMinutes: 30,
      category: 'Academic'
    },
    {
      id: 'td-4',
      title: 'Submit Functional English draft paragraph on Google Classroom',
      completed: false,
      priority: 'medium',
      dueDate: '2026-11-11',
      estimatedMinutes: 40,
      category: 'Project'
    },
    {
      id: 'td-5',
      title: 'Collect university student ID card from MAJU Admissions Office',
      completed: false,
      priority: 'low',
      dueDate: '2026-11-13',
      estimatedMinutes: 20,
      category: 'Admin'
    }
  ],
  studySessions: [
    {
      id: 'ss-1',
      courseCode: 'CS 1101',
      durationMinutes: 50,
      completedAt: '2026-11-07T14:30',
      notes: 'Programming Fundamentals: C++ Dynamic arrays and memory leaks'
    },
    {
      id: 'ss-2',
      courseCode: 'MT 1001',
      durationMinutes: 50,
      completedAt: '2026-11-07T16:00',
      notes: 'Calculus: Derivatives of trigonometric functions practice'
    },
    {
      id: 'ss-3',
      courseCode: 'CS 1002',
      durationMinutes: 45,
      completedAt: '2026-11-06T11:00',
      notes: 'ICT: Subnetting and IP addressing calculations'
    },
    {
      id: 'ss-4',
      courseCode: 'HU 1001',
      durationMinutes: 30,
      completedAt: '2026-11-05T19:00',
      notes: 'Functional English: Academic précis reading practice'
    }
  ]
};
