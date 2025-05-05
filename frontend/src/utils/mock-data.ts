import type { UserProfile } from "@/types/user"
import type { Material } from "@/types/material"
import type { PageResponse } from "@/types/pagination"

// Função para gerar um perfil de usuário mockado
export const getMockUserProfile = (isCurrentUser = false, userId?: string): UserProfile => {
  if (isCurrentUser) {
    return {
      id: "current-user-123",
      name: "Usuário Atual",
      email: "usuario@exemplo.com",
      profilePictureUrl: "/placeholder.svg?height=200&width=200",
      coverImageUrl: "/placeholder.svg?height=400&width=1200",
      institution: "Universidade Federal do Brasil",
      location: "São Paulo, SP",
      bio: "Estudante de Ciência da Computação apaixonado por tecnologia e educação. Compartilho materiais de estudo para ajudar outros estudantes.",
      headline: "Estudante de Ciência da Computação",
      website: "https://meuportfolio.com",
      joinDate: "2022-03-15T10:30:00Z",
      verified: true,
      role: "Estudante",
      socialLinks: {
        github: "https://github.com/usuario",
        linkedin: "https://linkedin.com/in/usuario",
        twitter: "https://twitter.com/usuario",
      },
      interests: ["Programação", "Inteligência Artificial", "Desenvolvimento Web", "Ciência de Dados"],
      stats: {
        totalUploads: 15,
        totalDownloads: 1250,
        totalLikes: 320,
        followers: 48,
        following: 72,
        rating: 4.8,
      },
      preferences: {
        emailNotifications: true,
        publicProfile: true,
      },
    }
  } else {
    // Gerar um perfil para outro usuário com base no ID
    const id = userId || `user-${Math.floor(Math.random() * 1000)}`
    const firstName = ["Maria", "João", "Ana", "Pedro", "Carla", "Lucas", "Juliana", "Rafael"][
      Math.floor(Math.random() * 8)
    ]
    const lastName = ["Silva", "Santos", "Oliveira", "Souza", "Pereira", "Costa", "Ferreira"][
      Math.floor(Math.random() * 7)
    ]
    const name = `${firstName} ${lastName}`
    const initial = name.charAt(0).toLowerCase()

    return {
      id,
      name,
      email: `${initial}${lastName.toLowerCase()}@exemplo.com`,
      profilePictureUrl: Math.random() > 0.3 ? `/placeholder.svg?height=200&width=200&text=${initial}` : undefined,
      coverImageUrl: Math.random() > 0.5 ? "/placeholder.svg?height=400&width=1200" : undefined,
      institution: [
        "Universidade de São Paulo",
        "Universidade Federal do Rio de Janeiro",
        "Universidade Estadual de Campinas",
        "Universidade Federal de Minas Gerais",
        "Pontifícia Universidade Católica",
      ][Math.floor(Math.random() * 5)],
      location: [
        "São Paulo, SP",
        "Rio de Janeiro, RJ",
        "Belo Horizonte, MG",
        "Brasília, DF",
        "Salvador, BA",
        "Recife, PE",
      ][Math.floor(Math.random() * 6)],
      bio: [
        "Professor universitário com foco em educação e tecnologia.",
        "Estudante de pós-graduação compartilhando conhecimento.",
        "Pesquisador na área de ciências exatas e tecnologia.",
        "Entusiasta de educação aberta e compartilhamento de conhecimento.",
        "Profissional da área de educação com experiência em ensino superior.",
      ][Math.floor(Math.random() * 5)],
      headline: [
        "Professor de Matemática",
        "Estudante de Doutorado",
        "Pesquisador em Física",
        "Engenheiro de Software",
        "Cientista de Dados",
      ][Math.floor(Math.random() * 5)],
      website: Math.random() > 0.6 ? `https://${firstName.toLowerCase()}${lastName.toLowerCase()}.com` : undefined,
      joinDate: new Date(Date.now() - Math.floor(Math.random() * 31536000000)).toISOString(), // Até 1 ano atrás
      verified: Math.random() > 0.8,
      role: ["Estudante", "Professor", "Pesquisador", "Profissional"][Math.floor(Math.random() * 4)],
      socialLinks: {
        github:
          Math.random() > 0.5 ? `https://github.com/${firstName.toLowerCase()}${lastName.toLowerCase()}` : undefined,
        linkedin:
          Math.random() > 0.4
            ? `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}`
            : undefined,
        twitter:
          Math.random() > 0.6 ? `https://twitter.com/${firstName.toLowerCase()}${lastName.toLowerCase()}` : undefined,
      },
      interests: [
        ["Matemática", "Física", "Química", "Biologia"][Math.floor(Math.random() * 4)],
        ["Programação", "Inteligência Artificial", "Machine Learning"][Math.floor(Math.random() * 3)],
        ["Educação", "Pedagogia", "Ensino à Distância"][Math.floor(Math.random() * 3)],
      ],
      stats: {
        totalUploads: Math.floor(Math.random() * 30),
        totalDownloads: Math.floor(Math.random() * 5000),
        totalLikes: Math.floor(Math.random() * 1000),
        followers: Math.floor(Math.random() * 200),
        following: Math.floor(Math.random() * 150),
        rating: (3 + Math.random() * 2).toFixed(1),
      },
      preferences: {
        emailNotifications: true,
        publicProfile: true,
      },
    }
  }
}

// Função para gerar materiais mockados para um usuário
export const getMockUserMaterials = (userId: string, count = 10): PageResponse<Material> => {
  const materials: Material[] = []

  const types = ["ARTICLE", "IMAGE", "TCC", "NOTES", "PRESENTATION", "EXERCISE", "OTHER"]
  const areas = ["COMPUTER_SCIENCE", "ENGINEERING", "MEDICINE", "BUSINESS", "LAW", "PSYCHOLOGY", "EDUCATION", "ARTS"]

  for (let i = 0; i < count; i++) {
    const createdAt = new Date(Date.now() - Math.floor(Math.random() * 31536000000)).toISOString()

    materials.push({
      id: `material-${userId}-${i}`,
      title: [
        "Introdução à Programação com Python",
        "Fundamentos de Cálculo Diferencial",
        "Guia Completo de Estruturas de Dados",
        "Resumo de Física Quântica",
        "Princípios de Administração Financeira",
        "Anatomia Humana: Guia Ilustrado",
        "Direito Constitucional: Conceitos Básicos",
        "Psicologia Cognitiva: Uma Introdução",
        "Metodologias Ativas de Ensino",
        "História da Arte Contemporânea",
      ][Math.floor(Math.random() * 10)],
      description: "Este material oferece uma visão abrangente sobre o tema, com exemplos práticos e exercícios.",
      type: types[Math.floor(Math.random() * types.length)],
      area: areas[Math.floor(Math.random() * areas.length)],
      author: getMockUserProfile(false, userId).name,
      authorId: userId,
      createdAt,
      fileType: ["PDF", "DOCX", "PPTX", "JPG", "PNG"][Math.floor(Math.random() * 5)],
      fileSize: `${Math.floor(Math.random() * 10) + 1}MB`,
      pages: Math.floor(Math.random() * 100) + 1,
      totalView: Math.floor(Math.random() * 1000),
      totalDownload: Math.floor(Math.random() * 500),
      likeCount: Math.floor(Math.random() * 200),
      commentCount: Math.floor(Math.random() * 50),
      keywords: ["educação", "estudo", "aprendizagem", "conhecimento", "universidade"].slice(
        0,
        Math.floor(Math.random() * 5) + 1,
      ),
      institution: getMockUserProfile(false, userId).institution,
    })
  }

  return {
    content: materials,
    pageable: {
      pageNumber: 0,
      pageSize: count,
      sort: {
        empty: false,
        sorted: true,
        unsorted: false,
      },
      offset: 0,
      paged: true,
      unpaged: false,
    },
    last: true,
    totalPages: 1,
    totalElements: materials.length,
    size: count,
    number: 0,
    sort: {
      empty: false,
      sorted: true,
      unsorted: false,
    },
    first: true,
    numberOfElements: materials.length,
    empty: materials.length === 0,
  }
}

// Função para gerar seguidores mockados
export const getMockFollowers = (userId: string, count = 8): UserProfile[] => {
  const followers: UserProfile[] = []

  for (let i = 0; i < count; i++) {
    const follower = getMockUserProfile(false, `follower-${userId}-${i}`)
    follower.isFollowing = Math.random() > 0.5 // Aleatoriamente definir se o usuário atual segue este seguidor
    followers.push(follower)
  }

  return followers
}

// Função para gerar usuários seguidos mockados
export const getMockFollowing = (userId: string, count = 8): UserProfile[] => {
  const following: UserProfile[] = []

  for (let i = 0; i < count; i++) {
    const followedUser = getMockUserProfile(false, `following-${userId}-${i}`)
    followedUser.isFollowing = true // O usuário atual segue todos estes
    following.push(followedUser)
  }

  return following
}

// Função para gerar materiais salvos mockados
export const getMockSavedMaterials = (count = 10): PageResponse<Material> => {
  const materials: Material[] = []

  for (let i = 0; i < count; i++) {
    const authorId = `author-${i}`
    const material = getMockUserMaterials(authorId, 1).content[0]
    material.savedAt = new Date(Date.now() - Math.floor(Math.random() * 31536000000)).toISOString()
    materials.push(material)
  }

  return {
    content: materials,
    pageable: {
      pageNumber: 0,
      pageSize: count,
      sort: {
        empty: false,
        sorted: true,
        unsorted: false,
      },
      offset: 0,
      paged: true,
      unpaged: false,
    },
    last: true,
    totalPages: 1,
    totalElements: materials.length,
    size: count,
    number: 0,
    sort: {
      empty: false,
      sorted: true,
      unsorted: false,
    },
    first: true,
    numberOfElements: materials.length,
    empty: materials.length === 0,
  }
}
