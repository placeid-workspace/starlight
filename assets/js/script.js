document.addEventListener('DOMContentLoaded',function(){
    const litecoinBtn=document.getElementById('litecoin-btn')
    const notification=document.getElementById('copy-notification')
    const litecoinAddress='LgCn2zpBbWwMfsZG2EfvvwuiYf7Y7JWAZ4'
    litecoinBtn.addEventListener('click',function(e){
        e.preventDefault()
        navigator.clipboard.writeText(litecoinAddress).then(()=>{showNotification()}).catch(()=>{notification.querySelector('span').textContent='Failed to copy address';showNotification()})
    })
    function showNotification(){notification.classList.add('show');setTimeout(()=>{notification.classList.remove('show')},3000)}
    const navLinks=document.querySelectorAll('.nav-link')
    navLinks.forEach(link=>{link.addEventListener('click',function(e){e.preventDefault();navLinks.forEach(l=>l.classList.remove('active'));this.classList.add('active')})})

    let audio=document.getElementById('bg')
    let played=false
    async function attemptPlay(){
        if(played) return
        try{
            await audio.play()
            played=true
            removeGestureListeners()
        }catch(err){
            try{
                const AC=window.AudioContext||window.webkitAudioContext
                if(AC){
                    const ctx=new AC()
                    const src=ctx.createMediaElementSource(audio)
                    src.connect(ctx.destination)
                    await ctx.resume()
                    await audio.play()
                    played=true
                    removeGestureListeners()
                    return
                }
            }catch(e){}
            showPlayFallback()
        }
    }
    function removeGestureListeners(){document.removeEventListener('click',attemptPlay);document.removeEventListener('keydown',attemptPlay)}
    function showPlayFallback(){
        if(document.getElementById('bg-play-fallback')) return
        const b=document.createElement('button')
        b.id='bg-play-fallback'
        b.textContent='▶'
        b.style.position='fixed'
        b.style.right='16px'
        b.style.bottom='16px'
        b.style.zIndex='9999'
        b.style.width='44px'
        b.style.height='44px'
        b.style.border='none'
        b.style.borderRadius='8px'
        b.style.fontSize='18px'
        b.style.cursor='pointer'
        document.body.appendChild(b)
        b.addEventListener('click',async function(){
            try{await audio.play();played=true;removeGestureListeners();b.remove()}catch(e){}
        })
    }
    document.addEventListener('click',attemptPlay)
    document.addEventListener('keydown',attemptPlay)

    const v=document.getElementById('vol')
    v.addEventListener('input',function(){
        audio.volume=this.value/100
    })
    audio.volume=0.5

    const projectsLink = document.querySelector('.nav-link:nth-child(2)')
    const projectsGrid = document.getElementById('projects-grid')

    const githubProjects = [
        {
            name: 'Pattern-Scan',
            url: 'https://github.com/placeid-workspace/Pattern-Scan',
            desc: 'some patternscan shit i threw together in a few minutes. does the job. wildcard support. works on any module. no bloat. no bs. just fast memory scanning.',
            code: `#include "PatternScan.hpp"

int main() {
    PatternScanner scanner(GetModuleHandle(nullptr));
    uintptr_t result = scanner.find("48 89 ?? ?? ?? 57 48 83 EC");
    return 0;
}`
        },
        {
            name: 'sigmaker',
            url: 'https://github.com/placeid-workspace/sigmaker',
            desc: 'simple signature generator for binary blobs. reads input.bin and spits out a pattern string. wildcard support for pointer-looking values. no bullshit, no bloat. just works (:',
            code: `#include <windows.h>
#include <stdio.h>

bool isptr(unsigned char* b)
{
    DWORD val = *(DWORD*)b;
    return val > 0x10000 && val < 0x7FFFFFFF;
}

int main(int argc, char** argv)
{
    FILE* f = 0;
    fopen_s(&f, "input.bin", "rb");
    if (!f) return 1;

    fseek(f, 0, 2);
    int len = ftell(f);
    fseek(f, 0, 0);

    unsigned char* buf = (unsigned char*)malloc(len);
    fread(buf, 1, len, f);
    fclose(f);

    for (int i = 0; i < len;)
    {
        if (i + 4 <= len && isptr(&buf[i]))
        {
            printf("? ? ? ? ");
            i += 4;
        }
        else
        {
            printf("%02X ", buf[i]);
            i++;
        }
    }

    free(buf);
    return 0;
}`
        },
        {
            name: 'linux-hex-editor',
            url: 'https://github.com/placeid-workspace/linux-hex-editor',
            desc: 'tiny linux hex editor i slapped together in like 5 minutes. dumps a file in hex and lets you overwrite any byte. no ncurses. no gui. no bullshit. just type a file, edit a byte, done..',
            code: `#include <iostream>
#include <fstream>
#include <vector>
#include <iomanip>
#include <sstream>

std::vector<unsigned char> readfile(const std::string&p){
    std::ifstream f(p,std::ios::binary);
    if(!f.is_open()) return {};
    return std::vector<unsigned char>((std::istreambuf_iterator<char>(f)),std::istreambuf_iterator<char>());
}

void writefile(const std::string&p,const std::vector<unsigned char>&d){
    std::ofstream f(p,std::ios::binary);
    f.write((char*)d.data(),d.size());
}

void dump(const std::vector<unsigned char>&d){
    for(size_t i=0;i<d.size();i++){
        if(i%16==0) std::cout<<std::setw(8)<<std::setfill('0')<<std::hex<<i<<"  ";
        std::cout<<std::setw(2)<<std::setfill('0')<<std::hex<<(int)d[i]<<" ";
        if(i%16==15) std::cout<<"\n";
    }
    std::cout<<"\n";
}

int hexbyte(const std::string&s){
    int v=0;
    std::stringstream ss;
    ss<<std::hex<<s;
    ss>>v;
    return v;
}

int main(){
    std::string path;
    std::cout<<"file: ";
    std::cin>>path;

    auto data=readfile(path);
    if(data.empty()){
        std::cout<<"failed\n";
        return 0;
    }

    dump(data);

    std::cout<<"offset hex (-1 exit): ";
    std::string off;
    std::cin>>off;
    if(off=="-1") return 0;

    size_t o=0;
    std::stringstream ss;
    ss<<std::hex<<off;
    ss>>o;

    if(o>=data.size()){
        std::cout<<"bad offset\n";
        return 0;
    }

    std::cout<<"new byte hex: ";
    std::string nb;
    std::cin>>nb;

    data[o]=hexbyte(nb)&0xff;
    writefile(path,data);

    std::cout<<"done\n";
    return 0;
}`
        }
    ]

    githubProjects.forEach(proj => {
        const card = document.createElement('div')
        card.classList.add('project-card')
        card.innerHTML = `
            <h3>${proj.name}</h3>
            <p>${proj.desc}</p>
            <pre>${proj.code}</pre>
            <a href="${proj.url}" target="_blank">View on GitHub</a>
        `
        projectsGrid.appendChild(card)
    })

    projectsLink.addEventListener('click', function(e){
        e.preventDefault()
        document.getElementById('projects').scrollIntoView({ behavior: 'smooth' })
        navLinks.forEach(l => l.classList.remove('active'))
        this.classList.add('active')
    })
})
