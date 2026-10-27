/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns: ['lh3.googleusercontent.com','res.cloudinary.com','picsum.photos','fastly.picsum.photos','i.pravatar.cc']
            .map((hostname) => ({protocol: 'https', hostname}))
    },
    serverExternalPackages:['cloudinary','graphql-request'],
    // Stop `next dev` from generating AGENTS.md
    agentRules: false,
}

module.exports = nextConfig
