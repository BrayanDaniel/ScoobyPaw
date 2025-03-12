

// Share functionality
document.addEventListener('DOMContentLoaded', function() {
    const shareBtn = document.querySelector('.share-btn');
    const shareModal = document.getElementById('share-modal');
    const shareCloseBtn = document.getElementById('share-close-btn');
    const shareScoreCount = document.getElementById('share-score-count');
    
    // Set up share buttons
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            // Update the score count in the share message
            if (shareScoreCount) {
                shareScoreCount.textContent = score;
            }
            
            // Show modal with animation
            shareModal.classList.add('active');
            
            // Play click sound
            AudioManager.play('click-sound').catch(e => {});
        });
    }
    
    // Close modal button
    if (shareCloseBtn) {
        shareCloseBtn.addEventListener('click', () => {
            shareModal.classList.remove('active');
            
            // Play click sound
            AudioManager.play('click-sound').catch(e => {});
        });
    }
    
    // Facebook share
    const facebookShare = document.querySelector('.facebook-share');
    if (facebookShare) {
        facebookShare.addEventListener('click', () => {
            const shareText = `I solved the mystery with ${score} correct answers out of ${totalQuestions} in Scoobi Paw's Mansion Adventure!`;
            const shareUrl = window.location.href;
            const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
            window.open(facebookUrl, '_blank');
        });
    }
    
    // Twitter share
    const twitterShare = document.querySelector('.twitter-share');
    if (twitterShare) {
        twitterShare.addEventListener('click', () => {
            const shareText = `I solved the mystery with ${score} correct answers out of ${totalQuestions} in Scoobi Paw's Mansion Adventure!`;
            const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
            window.open(twitterUrl, '_blank');
        });
    }
    
    // Email share
    const emailShare = document.querySelector('.email-share');
    if (emailShare) {
        emailShare.addEventListener('click', () => {
            const shareText = `I solved the mystery with ${score} correct answers out of ${totalQuestions} in Scoobi Paw's Mansion Adventure!`;
            const emailUrl = `mailto:?subject=My Score in Scoobi Paw's Adventure&body=${encodeURIComponent(shareText)}`;
            window.location.href = emailUrl;
        });
    }
    
    // Copy link
    const copyLink = document.querySelector('.copy-link');
    if (copyLink) {
        copyLink.addEventListener('click', () => {
            const shareText = `I solved the mystery with ${score} correct answers out of ${totalQuestions} in Scoobi Paw's Mansion Adventure!`;
            
            // Create a temporary textarea element to copy the text
            const textarea = document.createElement('textarea');
            textarea.value = shareText;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            
            // Indicate it was copied
            copyLink.textContent = '✓ Copied!';
            setTimeout(() => {
                copyLink.innerHTML = '<i class="fas fa-copy"></i> Copy Text';
            }, 2000);
        });
    }
});

// Replace the existing share button click handler with this
const updateShareButton = () => {
    const shareBtn = document.querySelector('.share-btn');
    if (shareBtn) {
        // Remove existing event listeners to prevent duplicates
        const newShareBtn = shareBtn.cloneNode(true);
        shareBtn.parentNode.replaceChild(newShareBtn, shareBtn);
        
        newShareBtn.addEventListener('click', () => {
            const shareModal = document.getElementById('share-modal');
            if (shareModal) {
                const shareScoreCount = document.getElementById('share-score-count');
                if (shareScoreCount) {
                    shareScoreCount.textContent = score;
                }
                shareModal.classList.add('active');
                AudioManager.play('click-sound').catch(e => {});
            }
        });
    }
};

// Call this function after game completion
document.addEventListener('DOMContentLoaded', updateShareButton);

// Función para corregir el ícono del botón de sonido
function fixSoundToggleIcon() {
    const soundToggle = document.querySelector('.sound-toggle') || document.getElementById('sound-toggle');
    
    if (soundToggle) {
        // Verificar si el sonido está realmente silenciado
        const soundsMuted = document.getElementById('correct-sound')?.muted || false;
        
        // Actualizar el ícono para reflejar el estado real
        if (soundsMuted) {
            soundToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else {
            soundToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
        
        // Asegurarse de que el evento de clic funcione correctamente
        soundToggle.onclick = function() {
            // Encontrar todos los elementos de audio (excepto música de fondo)
            const sounds = Array.from(document.querySelectorAll('audio:not(#background-music)'));
            
            // Determinar el estado actual basado en el primer sonido
            const currentlyMuted = sounds.length > 0 ? sounds[0].muted : false;
            
            // Cambiar al estado opuesto
            const newMutedState = !currentlyMuted;
            
            // Aplicar a todos los sonidos
            sounds.forEach(sound => {
                sound.muted = newMutedState;
            });
            
            // Actualizar el ícono
            if (newMutedState) {
                soundToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
            } else {
                soundToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
                // Reproducir un clic para confirmar que el sonido funciona
                if (document.getElementById('click-sound')) {
                    document.getElementById('click-sound').play().catch(e => {});
                }
            }
        };
    }
}


// Función para iniciar automáticamente el sonido
function autoStartSound() {
    // Desactivar el estado mute de todos los sonidos
    const sounds = document.querySelectorAll('audio');
    sounds.forEach(sound => {
        sound.muted = false;
    });
    
    // Intentar reproducir la música de fondo
    const backgroundMusic = document.getElementById('background-music');
    if (backgroundMusic) {
        backgroundMusic.play().catch(e => {
            console.log("Autoplay prevented:", e);
            
            // Si falla el autoplay, añadimos un evento de clic global para iniciar el sonido
            document.addEventListener('click', function initAudio() {
                backgroundMusic.play().catch(e => {});
                document.removeEventListener('click', initAudio);
            }, { once: true });
        });
    }
    
    // Corregir el ícono para que refleje el estado real
    fixSoundToggleIcon();
}



// Función para silenciar/activar todos los efectos de sonido
function muteAllSoundEffects(mute) {
    // Si estamos usando AudioManager
    if (typeof AudioManager !== 'undefined') {
        Object.keys(AudioManager.sounds).forEach(id => {
            // No silenciar la música de fondo, solo efectos
            if (id !== 'background-music') {
                const sound = AudioManager.sounds[id];
                if (sound && typeof sound.muted !== 'undefined') {
                    sound.muted = mute;
                }
            }
        });
    } else {
        // Método alternativo si no hay AudioManager
        const soundElements = document.querySelectorAll('audio:not(#background-music)');
        soundElements.forEach(audio => {
            audio.muted = mute;
        });
    }
    
    // Guardar el estado actual
    soundEffectsEnabled = !mute;
}

// Llamar a esta función cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    setupSoundToggle();
});

// Función para actualizar el ícono según el estado actual
function updateSoundToggleIcon() {
    const soundToggle = document.querySelector('.sound-toggle') || document.querySelector('[id*="sound-toggle"]');
    
    if (soundToggle) {
        if (soundEffectsEnabled) {
            soundToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
        } else {
            soundToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
        }
    }
}

// Llamar a esta función durante la inicialización
document.addEventListener('DOMContentLoaded', () => {
    setupSoundToggle();
});

// Función para mostrar confirmación personalizada
function showCustomConfirm(message, onConfirm, onCancel) {
    const modal = document.getElementById('confirm-modal');
    const confirmMessage = modal.querySelector('.confirm-message');
    const yesBtn = document.getElementById('confirm-yes');
    const noBtn = document.getElementById('confirm-no');
    
    // Establecer mensaje personalizado
    confirmMessage.textContent = message;
    
    // Mostrar el modal
    modal.classList.add('active');
    
    // Reproducir sonido de clic si está disponible
    if (typeof AudioManager !== 'undefined' && AudioManager.play) {
        AudioManager.play('click-sound');
    }
    
    // Configurar eventos de botones
    const handleYes = () => {
        modal.classList.remove('active');
        removeListeners();
        if (onConfirm) onConfirm();
    };
    
    const handleNo = () => {
        modal.classList.remove('active');
        removeListeners();
        if (onCancel) onCancel();
    };
    
    // Agregar eventos
    yesBtn.addEventListener('click', handleYes);
    noBtn.addEventListener('click', handleNo);
    
    // Función para eliminar los listeners cuando se cierre el modal
    function removeListeners() {
        yesBtn.removeEventListener('click', handleYes);
        noBtn.removeEventListener('click', handleNo);
    }
}

// Añadir esto al principio de tu script.js
document.addEventListener('click', function initAudio() {
    // Intenta reproducir la música de fondo una vez que el usuario haya interactuado
    AudioManager.play('background-music').catch(e => {
        console.log("Autoplay prevented:", e);
    });
    // Solo necesitamos esto una vez
    document.removeEventListener('click', initAudio);
}, { once: true });

// Función para mostrar/ocultar el botón de ayuda según la pantalla
function toggleHelpButton(showButton) {
    const helpBtn = document.querySelector('.help-btn');
    if (helpBtn) {
        helpBtn.style.display = showButton ? 'flex' : 'none';
    }
}

// Modifica la función showScreen para controlar la visibilidad del botón de ayuda
const originalShowScreen = showScreen;
showScreen = function(screen) {
    originalShowScreen(screen);
    
    // Mostrar el botón de ayuda solo en la pantalla de título
    const isTitle = screen.classList.contains('title-screen');
    toggleHelpButton(isTitle);
    
    // También puedes ocultar directamente el botón con clase "question-mark"
    const questionMarkBtn = document.querySelector('.question-mark-btn');
    if (questionMarkBtn) {
        questionMarkBtn.style.display = isTitle ? 'block' : 'none';
    }
};

// Botón para cerrar instrucciones
document.getElementById('close-instructions-btn').addEventListener('click', () => {
    toggleInstructions(false);
    // Asegurarse de mostrar la pantalla de inicio
    showScreen(titleScreen);
});

// Función para ajustar posiciones en caso de superposición
function adjustElementPositions() {
    // Ajustar posición de controles flotantes
    const floatingControls = document.getElementById('floating-controls');
    if (floatingControls) {
        floatingControls.style.top = '95px';
    }
    
    // Ajustar posición de elementos en las pantallas de habitación
    document.querySelectorAll('.room-screen').forEach(screen => {
        // Asegurar que el diálogo de pista esté bien posicionado
        const dialogBox = screen.querySelector('.dialog-box');
        if (dialogBox) {
            dialogBox.style.bottom = '100px';
            dialogBox.style.left = '20px';
            dialogBox.style.width = '250px';
            dialogBox.style.zIndex = '80';
        }
        
        // Ajustar posición del personaje
        const character = screen.querySelector('.character');
        if (character) {
            character.style.bottom = '20px';
            character.style.left = '70px';
            character.style.zIndex = '75';
        }
        
        // Ajustar contenedor de preguntas
        const questionContainer = screen.querySelector('.question-container');
        if (questionContainer) {
            questionContainer.style.marginTop = '100px';
        }
        
        // Ajustar barra de progreso
        const progressContainer = screen.querySelector('.progress-container');
        if (progressContainer) {
            progressContainer.style.top = '70px';
        }
        
        // Ajustar diálogo de pista mucho más arriba
        const dialogBoxes = document.querySelectorAll('.dialog-box');
        dialogBoxes.forEach(dialogBox => {
            dialogBox.style.bottom = '180px'; // Mover mucho más arriba
            dialogBox.style.left = '20px';
        });

        // Ajustar indicador de nivel
        const levelIndicator = screen.querySelector('.level-indicator');
        if (levelIndicator) {
            levelIndicator.style.top = '20px';
            levelIndicator.style.zIndex = '100';
        }
        
        // Ajustar insignia de dificultad
        const difficultyBadge = screen.querySelector('.difficulty-badge');
        if (difficultyBadge) {
            difficultyBadge.style.top = '20px';
            difficultyBadge.style.right = '120px';
            difficultyBadge.style.zIndex = '95';
        }
    });

    const dialogBox = screen.querySelector('.dialog-box');
    if (dialogBox) {
        dialogBox.style.bottom = '150px'; // Ajustar para que se vea mejor con el personaje
    }
    
    // Ocultar el botón de signo de interrogación en la pantalla de juego
    const helpBtn = document.querySelector('.help-btn');
    const questionMarkBtn = document.querySelector('.question-mark-btn');
    
    if (document.querySelector('.room-screen.active')) {
        // Estamos en una pantalla de juego
        if (helpBtn) helpBtn.style.display = 'none';
        if (questionMarkBtn) questionMarkBtn.style.display = 'none';
    } else if (document.querySelector('.title-screen.active')) {
        // Estamos en la pantalla de título
        if (helpBtn) helpBtn.style.display = 'flex';
        if (questionMarkBtn) questionMarkBtn.style.display = 'block';
    }
}

// Ejecutar esta función después de cargar la pantalla y cada vez que se cambie de habitación
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(adjustElementPositions, 200);
});

// Modificar la función showCurrentRoom para incluir ajuste de posiciones
const originalShowCurrentRoom = showCurrentRoom;
showCurrentRoom = function() {
    originalShowCurrentRoom();
    setTimeout(adjustElementPositions, 100);
};

// Limpia elementos duplicados para evitar problemas
function cleanupDuplicateElements() {
    // Eliminar botones y controles duplicados
    const musicBtns = document.querySelectorAll('.music-btn');
    if (musicBtns.length > 1) {
        for (let i = 1; i < musicBtns.length; i++) {
            musicBtns[i].remove();
        }
    }
    
    const soundControls = document.querySelectorAll('.sound-controls');
    if (soundControls.length > 1) {
        for (let i = 1; i < soundControls.length; i++) {
            soundControls[i].remove();
        }
    }
    
    const volumeControls = document.querySelectorAll('.volume-controls');
    if (volumeControls.length > 1) {
        for (let i = 1; i < volumeControls.length; i++) {
            volumeControls[i].remove();
        }
    }
    
    const instructionsBtns = document.querySelectorAll('.instructions-btn');
    if (instructionsBtns.length > 1) {
        for (let i = 1; i < instructionsBtns.length; i++) {
            instructionsBtns[i].remove();
        }
    }
}

// Llamar a esta función al inicio
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(cleanupDuplicateElements, 100);
});


// Utilidad para reproducción segura de audio
const AudioManager = {
    sounds: {},
    
    // Inicializa todos los elementos de audio
    init: function() {
        // Obtener todos los elementos audio del documento
        const audioElements = document.querySelectorAll('audio');
        
        // Almacenar referencia a cada elemento
        audioElements.forEach(audio => {
            this.sounds[audio.id] = audio;
            
            // Configurar manejo de errores para cada elemento
            audio.addEventListener('error', (e) => {
                console.warn(`Error loading audio ${audio.id}:`, e);
                // Marcar como no disponible
                this.sounds[audio.id].available = false;
            });
            
            // Marcar como disponible por defecto
            this.sounds[audio.id].available = true;
        });
        
        console.log("Audio manager initialized with", Object.keys(this.sounds).length, "sound elements");
        
        // Configurar volumen inicial
        this.setVolume(0.5);
    },

    
    // Reproducir un sonido de forma segura
    play: function(id) {
        const sound = this.sounds[id];
        
        if (!sound) {
            console.warn(`Sound '${id}' not found`);
            return;
        }
        
        if (!sound.available) {
            console.warn(`Sound '${id}' is not available (failed to load)`);
            return;
        }
        
        // Reiniciar el sonido si ya estaba reproduciéndose
        sound.currentTime = 0;
        
        // Intentar reproducir con manejo de errores
        sound.play().catch(e => {
            console.warn(`Error playing sound '${id}':`, e);
            // Si falla, marcarlo como no disponible
            sound.available = false;
        });
    },
    
    // Pausar un sonido de forma segura
    pause: function(id) {
        const sound = this.sounds[id];
        
        if (!sound || !sound.available) return;
        
        try {
            sound.pause();
        } catch (e) {
            console.warn(`Error pausing sound '${id}':`, e);
        }
    },
    
    // Detener todos los sonidos de una categoría
    stopCategory: function(pattern) {
        Object.keys(this.sounds).forEach(id => {
            if (id.includes(pattern) && this.sounds[id].available) {
                try {
                    this.sounds[id].pause();
                    this.sounds[id].currentTime = 0;
                } catch (e) {
                    console.warn(`Error stopping sound '${id}':`, e);
                }
            }
        });
    },
    
    // Configurar volumen para todos los sonidos
    setVolume: function(volume) {
        Object.values(this.sounds).forEach(sound => {
            if (sound.available) {
                sound.volume = volume;
            }
        });
    },
    
    // Silenciar/activar todos los sonidos
    mute: function(muted) {
        Object.values(this.sounds).forEach(sound => {
            if (sound.available) {
                sound.muted = muted;
            }
        });
    }
};

// Inicializar el administrador de audio al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar el administrador de audio
    AudioManager.init();
    
    // Reemplazar llamadas directas a métodos de audio por llamadas a AudioManager
    // Por ejemplo:
    // En lugar de correctSound.play(), usar AudioManager.play('correct-sound')
    // En lugar de backgroundMusic.pause(), usar AudioManager.pause('background-music')
});


function setupTitleScreen() {
    const titleBackground = document.querySelector('.title-background');
    
    // Añadir efecto parallax sutil cuando el mouse se mueve
    document.addEventListener('mousemove', (e) => {
        // Solo aplicar cuando la pantalla de título está activa
        if (!document.querySelector('.title-screen.active')) return;
        
        // Calcular movimiento basado en la posición del mouse (efecto sutil)
        const moveX = (e.clientX - window.innerWidth / 2) / 50;
        const moveY = (e.clientY - window.innerHeight / 2) / 50;
        
        // Aplicar transformación para efecto parallax
        if (titleBackground) {
            titleBackground.style.transform = `translate(${-moveX}px, ${-moveY}px)`;
        }
    });
    
    // Asegurar que los controles flotantes sean visibles desde el inicio
    const floatingControls = document.getElementById('floating-controls');
    if (floatingControls) {
        floatingControls.style.display = 'flex';
    }
}

// Game data
const gameData = {
    levels: [
        {
            name: "Level 1: Beginner",
            difficulty: "easy",
            rooms: [
                {
                    name: "The Haunted Attic",
                    background: "images/main-room.jpg", // Main room background
                    // NOTE: Replace this URL with your own image for the attic room background
                    ambience: "attic-ambience",
                    questions: [
                        {
                            text: "Why is there dust in the air?",
                            background: "images/dust.jpg", 
                            // NOTE: Replace this URL with your own image of dust particles in an attic
                            options: [
                                { text: "The wind has been blowing inside.", correct: true },
                                { text: "The wind have been blowing inside.", correct: false },
                                { text: "The wind has blew inside.", correct: false }
                            ]
                        },
                        {
                            text: "Why have the windows been rattling?",
                            background: "images/windows-been-rattling.jpg", 
                            // NOTE: Replace this URL with your own image of rattling windows
                            options: [
                                { text: "The wind has been shaking them.", correct: true },
                                { text: "The wind have been shaking them.", correct: false },
                                { text: "The wind has shaked them.", correct: false }
                            ]
                        },
                        {
                            text: "Why are the curtains moving?",
                            background: "images/curtains-moving.jpg", 
                            // NOTE: Replace this URL with your own image of moving curtains
                            options: [
                                { text: "The ghost has been playing with them.", correct: true },
                                { text: "The ghost have been playing with them.", correct: false },
                                { text: "The ghost has played with them.", correct: false }
                            ]
                        }
                    ],
                    clue: "Something has been moving near the windows..."
                },
                {
                    name: "The Dusty Library",
                    background: "images/main-library.jpg", // Main library background
                    // NOTE: Replace this URL with your own image for the library room background
                    ambience: "library-ambience",
                    questions: [
                        {
                            text: "Why are there so many books on the floor?",
                            background: "images/books-floor.jpg", 
                            // NOTE: Replace this URL with your own image of books on the floor
                            options: [
                                { text: "The shelves have been shaking.", correct: true },
                                { text: "The shelves has been shaking.", correct: false },
                                { text: "The shelves have shook.", correct: false }
                            ]
                        },
                        {
                            text: "Why is the old desk covered in dust?",
                            background: "images/dusty-desk.jpg", 
                            // NOTE: Replace this URL with your own image of a dusty desk
                            options: [
                                { text: "No one has been using it for years.", correct: true },
                                { text: "No one have been using it for years.", correct: false },
                                { text: "No one has used it for years.", correct: false }
                            ]
                        },
                        {
                            text: "Why are there candle marks on the table?",
                            background: "images/candle-marks.jpg", 
                            // NOTE: Replace this URL with your own image of candle marks on a table
                            options: [
                                { text: "Someone has been reading at night.", correct: true },
                                { text: "Someone have been reading at night.", correct: false },
                                { text: "Someone has read at night.", correct: false }
                            ]
                        }
                    ],
                    clue: "Someone has been reading these books in secret..."
                }
            ]
        },
        {
            name: "Level 2: Intermediate",
            difficulty: "medium",
            rooms: [
                {
                    name: "The Abandoned Dining Room",
                    background: "images/dining-room-background.jpg", // Main dining room background
                    // NOTE: Replace this URL with your own image for the dining room background
                    ambience: "dining-ambience",
                    questions: [
                        {
                            text: "Why is the table such a mess?",
                            background: "images/dining-table.jpg", 
                            // NOTE: Replace this URL with your own image of a messy dining table
                            options: [
                                { text: "Someone has been throwing the dishes.", correct: true },
                                { text: "Someone have been throwing the dishes.", correct: false },
                                { text: "Someone has threw the dishes.", correct: false }
                            ]
                        },
                        {
                            text: "Why is the chandelier still moving?",
                            background: "images/moving-chandelier.jpg", 
                            // NOTE: Replace this URL with your own image of a moving chandelier
                            options: [
                                { text: "The wind has been shaking it.", correct: true },
                                { text: "The wind have been shaking it.", correct: false },
                                { text: "The wind has shook it.", correct: false }
                            ]
                        },
                        {
                            text: "Why are there fresh footprints on the carpet?",
                            background: "images/footprints-on-carpet.jpg", 
                            // NOTE: Replace this URL with your own image of footprints on carpet
                            options: [
                                { text: "Someone has been searching for something.", correct: true },
                                { text: "Someone have been searching for something.", correct: false },
                                { text: "Someone has searched for something.", correct: false }
                            ]
                        }
                    ],
                    clue: "Something has been running through the dining room..."
                },
                {
                    name: "The Dark Basement",
                    background: "images/basement-background.jpg", // Main basement background
                    // NOTE: Replace this URL with your own image for the basement background
                    ambience: "basement-ambience",
                    questions: [
                        {
                            text: "Why is the floor wet?",
                            background: "images/wet-floor.jpg", 
                            // NOTE: Replace this URL with your own image of a wet floor
                            options: [
                                { text: "The pipes have been leaking.", correct: true },
                                { text: "The pipes has been leaking.", correct: false },
                                { text: "The pipes have leaked.", correct: false }
                            ]
                        },
                        {
                            text: "Why are the lights flickering?",
                            background: "images/flickering-lights.jpg", 
                            // NOTE: Replace this URL with your own image of flickering lights
                            options: [
                                { text: "Someone has been playing with the switch.", correct: true },
                                { text: "Someone have been playing with the switch.", correct: false },
                                { text: "Someone has played with the switch.", correct: false }
                            ]
                        },
                        {
                            text: "Why does the old couch smell strange?",
                            background: "images/old-couch.jpg", 
                            // NOTE: Replace this URL with your own image of an old couch
                            options: [
                                { text: "A wet dog has been sleeping on it.", correct: true },
                                { text: "A wet dog have been sleeping on it.", correct: false },
                                { text: "A wet dog has slept on it.", correct: false }
                            ]
                        }
                    ],
                    clue: "Someone has been hiding here..."
                }
            ]
        },
        {
            name: "Level 3: Expert",
            difficulty: "hard",
            rooms: [
                {
                    name: "The Portrait Gallery",
                    background: "images/gallery-background.jpg", // Main gallery background
                    // NOTE: Replace this URL with your own image for the gallery background
                    ambience: "gallery-ambience",
                    questions: [
                        {
                            text: "Why are the paintings tilted?",
                            background: "images/tilted-paintings.jpg", 
                            // NOTE: Replace this URL with your own image of tilted paintings
                            options: [
                                { text: "Someone has been touching them.", correct: true },
                                { text: "Someone have been touching them.", correct: false },
                                { text: "Someone has touched them.", correct: false }
                            ]
                        },
                        {
                            text: "Why is there a secret door behind the bookshelf?",
                            background: "images/secret-door.jpg", 
                            // NOTE: Replace this URL with your own image of a secret door
                            options: [
                                { text: "Someone has been pushing the bookshelf.", correct: true },
                                { text: "Someone have been pushing the bookshelf.", correct: false },
                                { text: "Someone has pushed the bookshelf.", correct: false }
                            ]
                        },
                        {
                            text: "Why is there an open window?",
                            background: "images/open-windows.jpg", 
                            // NOTE: Replace this URL with your own image of an open window
                            options: [
                                { text: "The thief has been escaping through it.", correct: true },
                                { text: "The thief have been escaping through it.", correct: false },
                                { text: "The thief has escaped through it.", correct: false }
                            ]
                        }
                    ],
                    clue: "Something has been moving through the walls..."
                },
                {
                    name: "The Secret Study",
                    background: "images/study-background.jpg", // Main study background
                    // NOTE: Replace this URL with your own image for the study background
                    ambience: "study-ambience",
                    questions: [
                        {
                            text: "Why is the chair still warm?",
                            background: "images/warm-chair.jpg", 
                            // NOTE: Replace this URL with your own image of a warm chair
                            options: [
                                { text: "Someone has been sitting here recently.", correct: true },
                                { text: "Someone have been sitting here recently.", correct: false },
                                { text: "Someone has sat here recently.", correct: false }
                            ]
                        },
                        {
                            text: "Why are there fresh footprints on the floor?",
                            background: "images/footprints.jpg", 
                            // NOTE: Replace this URL with your own image of footprints
                            options: [
                                { text: "Someone has been walking around.", correct: true },
                                { text: "Someone have been walking around.", correct: false },
                                { text: "Someone has walked around.", correct: false }
                            ]
                        },
                        {
                            text: "Why is there a strange noise coming from the chimney?",
                            background: "images/chimney.jpg", 
                            // NOTE: Replace this URL with your own image of a chimney
                            options: [
                                { text: "The wind has been blowing through it all night.", correct: true },
                                { text: "The wind have been blowing through it all night.", correct: false },
                                { text: "The wind has blown through it all night.", correct: false }
                            ]
                        }
                    ],
                    clue: "The person we're looking for has been searching for something valuable..."
                }
            ]
        },
        {
            name: "Level 4: Master Detective",
            difficulty: "hard",
            rooms: [
                {
                    name: "The Creepy Conservatory",
                    background: "images/conservatory-background.jpg", // Main conservatory background
                    // NOTE: Replace this URL with your own image for the conservatory background
                    ambience: "gallery-ambience", // Reusing gallery ambience
                    questions: [
                        {
                            text: "Why are the plants dying despite the water?",
                            background: "images/dying-plants.jpg", 
                            // NOTE: Replace this URL with your own image of dying plants
                            options: [
                                { text: "Someone has been poisoning them.", correct: true },
                                { text: "Someone have been poisoning them.", correct: false },
                                { text: "Someone has poisoned them.", correct: false }
                            ]
                        },
                        {
                            text: "Why is there soil on the floor?",
                            background: "images/soil-on-floor.jpg", 
                            // NOTE: Replace this URL with your own image of soil on floor
                            options: [
                                { text: "The gardener has been replanting at night.", correct: true },
                                { text: "The gardener have been replanting at night.", correct: false },
                                { text: "The gardener has replanted at night.", correct: false }
                            ]
                        },
                        {
                            text: "Why are there scratches on the glass roof?",
                            background: "images/glass-roof.jpg", 
                            // NOTE: Replace this URL with your own image of scratched glass roof
                            options: [
                                { text: "Someone has been trying to break in from above.", correct: true },
                                { text: "Someone have been trying to break in from above.", correct: false },
                                { text: "Someone has tried to break in from above.", correct: false }
                            ]
                        }
                    ],
                    clue: "Our suspect has been disguising their activities as gardening work..."
                },
                {
                    name: "The Master Bedroom",
                    background: "images/bedroom-background.jpg", // Main bedroom background
                    // NOTE: Replace this URL with your own image for the bedroom background
                    ambience: "attic-ambience", // Reusing attic ambience
                    questions: [
                        {
                            text: "Why is the jewelry box empty?",
                            background: "images/jewelry-box.jpg", 
                            // NOTE: Replace this URL with your own image of empty jewelry box
                            options: [
                                { text: "The thief has been collecting valuable items.", correct: true },
                                { text: "The thief have been collecting valuable items.", correct: false },
                                { text: "The thief has collected valuable items.", correct: false }
                            ]
                        },
                        {
                            text: "Why are there marks on the wall safe?",
                            background: "images/marked-wall-safe.jpg", 
                            // NOTE: Replace this URL with your own image of marked wall safe
                            options: [
                                { text: "Someone has been trying to crack the code.", correct: true },
                                { text: "Someone have been trying to crack the code.", correct: false },
                                { text: "Someone has tried to crack the code.", correct: false }
                            ]
                        },
                        {
                            text: "Why is the bed unmade?",
                            background: "images/bed-unmade.jpg", 
                            // NOTE: Replace this URL with your own image of unmade bed
                            options: [
                                { text: "The suspect has been hiding under the covers.", correct: true },
                                { text: "The suspect have been hiding under the covers.", correct: false },
                                { text: "The suspect has hid under the covers.", correct: false }
                            ]
                        }
                    ],
                    clue: "The thief has been looking specifically for a hidden treasure map..."
                }
            ]
        }
    ],
    // End of levels data - CORRECTED POSITION OF ENDING OBJECT
    // Game ending configuration
    ending: {
        background: "images/congratulations2.jpg", // Final scene background
        // NOTE: Replace this URL with your own image for the final scene background
        message: "You've solved the mystery! The 'ghost' is actually the librarian Mr. Pawsworth, who has been searching for a hidden treasure in the mansion. Thank you for helping Scoobi Paw solve this case!"
    }
};


function createRoomScreens() {
    // Clear any existing room screens
    document.querySelectorAll('.room-screen').forEach(screen => screen.remove());
    roomScreens = [];
    
    // Create screens for each room in each level
    gameData.levels.forEach((level, levelIndex) => {
        level.rooms.forEach((room, roomIndex) => {
            const roomScreen = createImprovedRoomScreen(level, levelIndex, room, roomIndex);
            gameContainer.appendChild(roomScreen);
            roomScreens.push(roomScreen);
        });
    });
}

// Calculate total questions
let totalQuestions = 0;
gameData.levels.forEach(level => {
    level.rooms.forEach(room => {
        totalQuestions += room.questions.length;
    });
});

// Variables for the game
let currentLevel = 0;
let currentRoom = 0;
let currentQuestion = 0;
let score = 0;
let playerName = "";
let discoveredClues = [];
let roomScreens = [];
let currentAmbience = null;

// DOM elements
const gameContainer = document.querySelector('.game-container');
const titleScreen = document.querySelector('.title-screen');
const finalScreen = document.querySelector('.final-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const playerNameInput = document.getElementById('player-name');
const finalMessage = document.getElementById('final-message');
const hintContainer = document.querySelector('.hint-container');
const cluesList = document.getElementById('clues-list');
const closeHintBtn = document.getElementById('close-hint-btn');
const overlay = document.querySelector('.overlay');
const celebration = document.getElementById('celebration');

// Sistema unificado de control de audio
const AudioController = {
    soundEffectsEnabled: true,
    musicEnabled: true,
    
    init: function() {
        // Configurar botones de audio
        const soundToggle = document.getElementById('sound-toggle');
        const musicToggle = document.getElementById('music-toggle');
        
        if (soundToggle) {
            soundToggle.onclick = () => this.toggleSoundEffects();
            // Establecer ícono inicial
            this.updateSoundEffectsIcon();
        }
        
        if (musicToggle) {
            musicToggle.onclick = () => this.toggleMusic();
            // Establecer ícono inicial
            this.updateMusicIcon();
        }
        
        // Iniciar música si está habilitada
        if (this.musicEnabled) {
            const backgroundMusic = document.getElementById('background-music');
            if (backgroundMusic) {
                backgroundMusic.play().catch(e => {
                    console.log("Autoplay prevented:", e);
                });
            }
        }
    },
    
    toggleSoundEffects: function() {
        this.soundEffectsEnabled = !this.soundEffectsEnabled;
        
        // Aplicar el cambio a todos los sonidos (excepto música)
        const sounds = document.querySelectorAll('audio:not(#background-music)');
        sounds.forEach(sound => {
            sound.muted = !this.soundEffectsEnabled;
        });
        
        // Actualizar el ícono
        this.updateSoundEffectsIcon();
        
        // Reproducir sonido de confirmación
        if (this.soundEffectsEnabled && document.getElementById('click-sound')) {
            document.getElementById('click-sound').play().catch(e => {});
        }
    },
    
    toggleMusic: function() {
        this.musicEnabled = !this.musicEnabled;
        
        const backgroundMusic = document.getElementById('background-music');
        if (backgroundMusic) {
            if (this.musicEnabled) {
                backgroundMusic.play().catch(e => {});
            } else {
                backgroundMusic.pause();
            }
        }
        
        // Actualizar el ícono
        this.updateMusicIcon();
    },
    
    updateSoundEffectsIcon: function() {
        const soundToggle = document.getElementById('sound-toggle');
        if (soundToggle) {
            soundToggle.innerHTML = this.soundEffectsEnabled ? 
                '<i class="fas fa-volume-up"></i>' : 
                '<i class="fas fa-volume-mute"></i>';
        }
    },
    
    updateMusicIcon: function() {
        const musicToggle = document.getElementById('music-toggle');
        if (musicToggle) {
            musicToggle.innerHTML = this.musicEnabled ? 
                '<i class="fas fa-music"></i>' : 
                '<i class="fas fa-volume-mute"></i>';
        }
    }
};

// Inicializar el controlador de audio cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    AudioController.init();
});


// Añade llamadas a updateAudioIcons en los lugares donde cambias de pantalla
startBtn.addEventListener('click', () => {
    // código existente...
    updateAudioIcons();
});

restartBtn.addEventListener('click', () => {
    // código existente...
    updateAudioIcons();
});

// Audio elements
const correctSound = document.getElementById('correct-sound');
const wrongSound = document.getElementById('wrong-sound');
const levelCompleteSound = document.getElementById('level-complete-sound');
const gameCompleteSound = document.getElementById('game-complete-sound');
const hintSound = document.getElementById('hint-sound');
const backgroundMusic = document.getElementById('background-music');
const ambienceSounds = {
    'attic-ambience': document.getElementById('attic-ambience'),
    'library-ambience': document.getElementById('library-ambience'),
    'dining-ambience': document.getElementById('dining-ambience'),
    'basement-ambience': document.getElementById('basement-ambience'),
    'gallery-ambience': document.getElementById('gallery-ambience'),
    'study-ambience': document.getElementById('study-ambience')
};

// Function to create room screens
// Update the createImprovedRoomScreen function to position elements better
function createImprovedRoomScreen(level, levelIndex, room, roomIndex) {
    const roomScreen = document.createElement('div');
    roomScreen.className = 'screen room-screen';
    roomScreen.style.backgroundImage = `url(${room.background})`;
    roomScreen.dataset.level = levelIndex;
    roomScreen.dataset.room = roomIndex;

    // Nombre de la habitación
    const roomName = document.createElement('h2');
    roomName.className = 'room-name';
    roomName.textContent = room.name;
    roomScreen.appendChild(roomName);

    // Indicador de nivel (centrado)
    const levelIndicator = document.createElement('div');
    levelIndicator.className = 'level-indicator';
    levelIndicator.textContent = level.name;
    roomScreen.appendChild(levelIndicator);

    // Barra de progreso (centrada)
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-container';
    roomScreen.appendChild(progressContainer);

    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressContainer.appendChild(progressBar);

    const progressText = document.createElement('div');
    progressText.className = 'progress-text';
    progressText.textContent = `Progress: 0/${totalQuestions}`;
    progressContainer.appendChild(progressText);

    // Insignia de dificultad
    const difficultyBadge = document.createElement('div');
    difficultyBadge.className = `difficulty-badge difficulty-${level.difficulty}`;
    difficultyBadge.textContent = level.difficulty.charAt(0).toUpperCase() + level.difficulty.slice(1);
    roomScreen.appendChild(difficultyBadge);

    // Personaje
    const character = document.createElement('img');
    character.className = 'character';
    character.src = 'images/character.png'; 
    character.alt = 'Scoobi Paw';
    roomScreen.appendChild(character);

    // Diálogo (con la etiqueta PISTA)
    const dialogBox = document.createElement('div');
    dialogBox.className = 'dialog-box';
    dialogBox.innerHTML = '<strong>CLUE:</strong><br>Something strange is going on here! Help me investigate...';
    roomScreen.appendChild(dialogBox);

    // Contenedor de preguntas
    const questionContainer = document.createElement('div');
    questionContainer.className = 'question-container';
    roomScreen.appendChild(questionContainer);

    // Fondo de la pregunta
    const questionBackground = document.createElement('div');
    questionBackground.className = 'question-background';
    questionContainer.appendChild(questionBackground);
    
    // Imagen de la pregunta
    const questionImage = document.createElement('img');
    questionImage.className = 'question-image';
    questionImage.style.display = 'none'; 
    questionContainer.appendChild(questionImage);

    // Texto de la pregunta
    const question = document.createElement('div');
    question.className = 'question';
    question.style.fontSize = '1.3rem';
    question.style.fontWeight = 'bold';
    question.style.marginBottom = '15px';
    questionContainer.appendChild(question);

    // Opciones
    const options = document.createElement('div');
    options.className = 'options';
    options.style.width = '100%';
    questionContainer.appendChild(options);

    // Botón de pistas
    const hintBtn = document.createElement('button');
    hintBtn.className = 'btn btn-hint';
    hintBtn.innerHTML = '<i class="fas fa-search"></i> View Clues';
    hintBtn.addEventListener('click', showHints);
    roomScreen.appendChild(hintBtn);

    // Añadir el botón "Play Again" 
const playAgainBtn = document.createElement('button');
playAgainBtn.className = 'play-again-btn';
playAgainBtn.innerHTML = '<i class="fas fa-redo"></i> Play Again';
playAgainBtn.addEventListener('click', () => {
    // Usar confirmación personalizada en lugar de confirm()
    showCustomConfirm('¿Quieres reiniciar el juego? Tu progreso actual se perderá.', 
        // onConfirm callback
        () => {
            showScreen(titleScreen);
            playerNameInput.value = playerName;
            
            // Reproducir sonido de clic
            if (typeof AudioManager !== 'undefined' && AudioManager.play) {
                AudioManager.play('click-sound');
            }
        },
        // onCancel callback
        () => {
            // Nada que hacer al cancelar
            console.log('Reinicio cancelado');
        }
    );
});
roomScreen.appendChild(playAgainBtn);

    return roomScreen;
}

// Function to show the current screen
function showScreen(screen) {
    document.querySelectorAll('.screen').forEach(s => {
        s.classList.remove('active');
        s.style.display = 'none';
    });
    
    screen.classList.add('active');
    screen.style.display = 'flex';
    
    // Si es la pantalla de título, asegurarse de que se muestre correctamente
    if (screen.classList.contains('title-screen')) {
        // Asegurar que el fondo está visible
        const titleBackground = document.querySelector('.title-background');
        if (titleBackground) {
            titleBackground.style.opacity = '1';
        }
    }
}

// Function to show the current room
// Modificar la función showCurrentRoom
function showCurrentRoom() {
    // Detener sonidos ambientales anteriores
    Object.values(ambienceSounds).forEach(sound => {
        sound.pause();
        sound.currentTime = 0;
    });

    const currentRoomScreen = roomScreens.find(screen => 
        parseInt(screen.dataset.level) === currentLevel && 
        parseInt(screen.dataset.room) === currentRoom
    );
    
    if (currentRoomScreen) {
        showScreen(currentRoomScreen);
        updateQuestionDisplay();
        updateProgressBar();
        
        // Reproducir sonido ambiental
        const currentRoomData = gameData.levels[currentLevel].rooms[currentRoom];
        if (currentRoomData.ambience && ambienceSounds[currentRoomData.ambience]) {
            currentAmbience = ambienceSounds[currentRoomData.ambience];
            currentAmbience.volume = 0.3;
            // Usar esta forma simplificada
            if (AudioController.soundEffectsEnabled) {
                currentAmbience.play().catch(e => console.log("Could not play ambience:", e));
            }
        }
    }
}

// Function to update the progress bar
function updateProgressBar() {
    const currentRoomScreen = roomScreens.find(screen => 
        parseInt(screen.dataset.level) === currentLevel && 
        parseInt(screen.dataset.room) === currentRoom
    );
    
    if (currentRoomScreen) {
        const progressBar = currentRoomScreen.querySelector('.progress-bar');
        const progressText = currentRoomScreen.querySelector('.progress-text');
        const progressPercentage = (score / totalQuestions) * 100;
        
        progressBar.style.width = `${progressPercentage}%`;
        progressText.textContent = `Progress: ${score}/${totalQuestions}`;
    }
}

// Función para mostrar la pregunta actual con imagen visible
function updateQuestionDisplay() {
    const currentRoomScreen = roomScreens.find(screen => 
        parseInt(screen.dataset.level) === currentLevel && 
        parseInt(screen.dataset.room) === currentRoom
    );
    
    if (!currentRoomScreen) return;
    
    const currentRoomData = gameData.levels[currentLevel].rooms[currentRoom];
    const currentQuestionData = currentRoomData.questions[currentQuestion];
    
    const questionElement = currentRoomScreen.querySelector('.question');
    const optionsElement = currentRoomScreen.querySelector('.options');
    const questionBackgroundElement = currentRoomScreen.querySelector('.question-background');
    
    // Set question background if available
    if (currentQuestionData.background) {
        questionBackgroundElement.style.backgroundImage = `url(${currentQuestionData.background})`;
        
        // Añadir o actualizar imagen visible
        let questionImageElement = currentRoomScreen.querySelector('.question-image');
        if (!questionImageElement) {
            questionImageElement = document.createElement('img');
            questionImageElement.className = 'question-image';
            currentRoomScreen.querySelector('.question-container').insertBefore(
                questionImageElement, 
                questionElement
            );
        }
        questionImageElement.src = currentQuestionData.background;
        questionImageElement.alt = currentQuestionData.text;
        questionImageElement.style.display = 'block';
    } else {
        questionBackgroundElement.style.backgroundImage = 'none';
        // Ocultar imagen si existe
        const questionImageElement = currentRoomScreen.querySelector('.question-image');
        if (questionImageElement) {
            questionImageElement.style.display = 'none';
        }
    }
    
    questionElement.textContent = currentQuestionData.text;
    optionsElement.innerHTML = '';
    
    currentQuestionData.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.textContent = option.text;
        optionElement.dataset.index = index;
        optionElement.addEventListener('click', handleOptionClick);
        optionsElement.appendChild(optionElement);
    });
}

// Function to handle option clicks
function handleOptionClick(event) {
    const optionIndex = parseInt(event.target.dataset.index);
    const currentRoomData = gameData.levels[currentLevel].rooms[currentRoom];
    const currentQuestionData = currentRoomData.questions[currentQuestion];
    const isCorrect = currentQuestionData.options[optionIndex].correct;
    
    // Temporarily disable all options
    const options = document.querySelectorAll('.option');
    options.forEach(opt => opt.style.pointerEvents = 'none');
    
    // Show correct/incorrect result
    if (isCorrect) {
        event.target.classList.add('correct');
        AudioManager.play('correct-sound');
        score++;
        updateProgressBar();
        
        const currentRoomScreen = roomScreens.find(screen => 
            parseInt(screen.dataset.level) === currentLevel && 
            parseInt(screen.dataset.room) === currentRoom
        );
        
        const character = currentRoomScreen.querySelector('.character');
        const dialogBox = currentRoomScreen.querySelector('.dialog-box');
        
        dialogBox.textContent = 'Correct! Let\'s continue investigating.';
        
        // Advance to the next question or room after a delay
        setTimeout(() => {
            currentQuestion++;
            
            // If we completed all questions in this room
            if (currentQuestion >= currentRoomData.questions.length) {
                // Add discovered clue
                discoveredClues.push({
                    room: currentRoomData.name,
                    clue: currentRoomData.clue,
                    level: gameData.levels[currentLevel].name
                });
                
                updateCluesList();
                
                dialogBox.textContent = `You found a clue! ${currentRoomData.clue}`;
                
                // Show room completion celebration
                AudioManager.play('level-complete-sound');
                createConfetti();
                
                // Move to the next room or level after a delay
                setTimeout(() => {
                    currentQuestion = 0;
                    currentRoom++;
                    
                    // If we completed all rooms in this level
                    if (currentRoom >= gameData.levels[currentLevel].rooms.length) {
                        currentRoom = 0;
                        currentLevel++;
                        
                        // If we completed all levels
                        if (currentLevel >= gameData.levels.length) {
                            console.log("All levels completed, showing ending screen");
                            showEndingScreen();
                            return;
                        }
                    }
                    
                    showCurrentRoom();
                }, 3000);
            } else {
                // Go to the next question
                updateQuestionDisplay();
            }
        }, 1500);
    } else {
        event.target.classList.add('incorrect');
        AudioManager.play('wrong-sound');
        
        const currentRoomScreen = roomScreens.find(screen => 
            parseInt(screen.dataset.level) === currentLevel && 
            parseInt(screen.dataset.room) === currentRoom
        );
        
        const character = currentRoomScreen.querySelector('.character');
        const dialogBox = currentRoomScreen.querySelector('.dialog-box');
        
        character.classList.add('scared');
        dialogBox.textContent = 'Oh no! That\'s not right. Let\'s try again.';
        
        // Remove scared animation after a delay
        setTimeout(() => {
            character.classList.remove('scared');
            
            // Re-enable options
            options.forEach(opt => {
                opt.style.pointerEvents = 'auto';
                opt.classList.remove('incorrect');
            });
        }, 1500);
    }
}

// Reemplaza la función showEndingScreen por esta versión mejorada
// Reemplaza la función showEndingScreen por esta versión mejorada con certificado
function showEndingScreen() {
    console.log("Showing ending screen");
    
    // Detener sonidos ambientales
    Object.values(ambienceSounds).forEach(sound => {
        if (sound && typeof sound.pause === 'function') {
            sound.pause();
            sound.currentTime = 0;
        }
    });
    
    // Reproducir sonido de victoria
    AudioManager.play('game-complete-sound');
    
    // Efectos visuales
    createConfetti();
    createFireworks();
    
    // Construir el contenido de la pantalla final
    if (finalMessage) {
        const percentage = Math.round((score / totalQuestions) * 100);
        
        // Crear HTML con mejor estructura
        finalMessage.innerHTML = `
            <h2 class="final-title">Case Solved!</h2>
            <p>Congratulations, ${playerName}! You've solved the mystery!</p>
            <p>The 'ghost' is actually the librarian Mr. Pawsworth, who has been searching for a hidden treasure in the mansion.</p>
            
            <div class="achievement-certificate">
                <div class="certificate-title">Detective Certificate</div>
                <p>This certifies that</p>
                <p style="font-size: 1.8rem; font-weight: bold; margin: 10px 0;">${playerName}</p>
                <p>has successfully solved the Mystery of the Abandoned Mansion</p>
                <p>with <span style="font-weight: bold; color: #ff9100">${score}</span> out of <span style="font-weight: bold;">${totalQuestions}</span> correct answers (${percentage}%)</p>
                <div class="certificate-seal">
                    <i class="fas fa-medal"></i>
                </div>
            </div>
            
            <div class="discovered-clues-section">
                <h3 class="discovered-clues-title">Discovered Clues:</h3>
                <ul class="clues-final">
                    ${discoveredClues.map(clue => `<li>${clue.clue}</li>`).join('')}
                </ul>
            </div>
            
            <p class="final-rating">${getFinalRating()}</p>
        `;
    }
    
    // Establecer fondo
    if (finalScreen && gameData.ending && gameData.ending.background) {
        finalScreen.style.backgroundImage = `url(${gameData.ending.background})`;
    }
    
    // Mostrar pantalla
    showScreen(finalScreen);
    
    // Asegurar visibilidad de controles
    const floatingControls = document.getElementById('floating-controls');
    if (floatingControls) {
        floatingControls.style.display = 'flex';
    }
    
    // Scroll al inicio para asegurar que se vea todo
    setTimeout(() => {
        finalScreen.scrollTop = 0;
    }, 100);
}

function setupTitleBackground() {
    const titleBg = document.querySelector('.title-background');
    if (titleBg) {
        // If you want to set a specific background image for the title screen
        titleBg.style.backgroundImage = 'url(images/fondo.jpg)';
        
        // Add a parallax effect on mouse move
        document.addEventListener('mousemove', (e) => {
            // Only apply the effect when the title screen is active
            if (!document.querySelector('.title-screen.active')) return;
            
            // Calculate movement based on mouse position
            const moveX = (e.clientX - window.innerWidth / 2) / 50;
            const moveY = (e.clientY - window.innerHeight / 2) / 50;
            
            // Apply the transform to create a subtle parallax effect
            titleBg.style.transform = `translate(${-moveX}px, ${-moveY}px)`;
        });
    }
    
    // Add floating effect to the ghost icon
    const ghostIcon = document.querySelector('.ghost-icon');
    if (ghostIcon) {
        // The float animation is already defined in CSS
        ghostIcon.classList.add('float-animation');
    }
}


// Function to show hints
function showHints() {
    AudioManager.play('hint-sound');
    updateCluesList();
    hintContainer.classList.add('active');
    overlay.classList.add('active');
}

// Function to update the clues list
function updateCluesList() {
    cluesList.innerHTML = '';
    
    if (discoveredClues.length === 0) {
        cluesList.innerHTML = '<div class="clue-item">You haven\'t discovered any clues yet. Keep investigating!</div>';
        return;
    }
    
    discoveredClues.forEach((clue, index) => {
        const clueItem = document.createElement('div');
        clueItem.className = 'clue-item revealed';
        clueItem.innerHTML = `
            <strong>${clue.room} (${clue.level}):</strong> ${clue.clue}
        `;
        cluesList.appendChild(clueItem);
    });
}

// Function to close the hints panel
closeHintBtn.addEventListener('click', () => {
    hintContainer.classList.remove('active');
    overlay.classList.remove('active');
});

// Function to create confetti effect
function createConfetti() {
    celebration.innerHTML = '';
    celebration.classList.add('active');
    
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        confetti.style.animationDelay = (Math.random() * 2) + 's';
        celebration.appendChild(confetti);
    }
    
    setTimeout(() => {
        celebration.classList.remove('active');
    }, 5000);
}

// Function to get final rating based on score
function getFinalRating() {
    const percentage = (score / totalQuestions) * 100;
    
    if (percentage >= 90) {
        return "You're an expert detective! Scoobi Paw wants you on his team permanently.";
    } else if (percentage >= 70) {
        return "Great job detective! You've helped solve the mystery.";
    } else if (percentage >= 50) {
        return "You've helped solve the mystery, but you need more practice with Present Perfect Continuous.";
    } else {
        return "You found the culprit, but with a bit of luck. Keep practicing!";
    }
}

// Event to start the game
// Evento para iniciar el juego
startBtn.addEventListener('click', () => {
    playerName = playerNameInput.value.trim() || 'Detective';
    createRoomScreens();
    currentLevel = 0;
    currentRoom = 0;
    currentQuestion = 0;
    score = 0;
    discoveredClues = [];
    showCurrentRoom();
    
    // Iniciar música de forma consistente
    if (AudioController.musicEnabled) {
        const backgroundMusic = document.getElementById('background-music');
        if (backgroundMusic) {
            backgroundMusic.volume = 0.5;
            backgroundMusic.play().catch(e => console.log("Could not play background music:", e));
        }
    }
});

// Event to restart the game
restartBtn.addEventListener('click', () => {
    showScreen(titleScreen);
    playerNameInput.value = playerName;
});


// También en cualquier otra parte donde uses este ícono
function toggleMusic(play) {
    const musicToggle = document.getElementById('music-toggle');
    if (play) {
        AudioManager.play('background-music').catch(e => {});
        musicToggle.innerHTML = '<i class="fas fa-music"></i>';
    } else {
        backgroundMusic.pause();
        musicToggle.innerHTML = '<i class="fas fa-volume-mute"></i>'; // Cambiado a un ícono que existe
    }
}


// Add music toggle button
const toggleMusicBtn = document.createElement('button');
toggleMusicBtn.className = 'btn music-btn';
toggleMusicBtn.innerHTML = '<i class="fas fa-volume-up"></i> Mute';

gameContainer.appendChild(toggleMusicBtn);

// Add volume control slider
const volumeControls = document.createElement('div');
volumeControls.className = 'volume-controls';
volumeControls.innerHTML = `
    <i class="fas fa-volume-down"></i>
    <input type="range" class="volume-slider" min="0" max="100" value="50">
    <i class="fas fa-volume-up"></i>
`;
gameContainer.appendChild(volumeControls);

const volumeSlider = volumeControls.querySelector('.volume-slider');
volumeSlider.addEventListener('input', (e) => {
    const volume = e.target.value / 100;
    backgroundMusic.volume = volume;
    
    // Adjust ambient sound volume too
    Object.values(ambienceSounds).forEach(sound => {
        sound.volume = volume * 0.6; // Slightly lower for ambient sounds
    });
});

// Add sound effects toggle
const soundControlsBtn = document.createElement('div');
soundControlsBtn.className = 'sound-controls';
soundControlsBtn.innerHTML = '<i class="fas fa-bell"></i>';
let soundEffectsEnabled = true;

soundControlsBtn.addEventListener('click', () => {
    soundEffectsEnabled = !soundEffectsEnabled;
    
    if (soundEffectsEnabled) {
        soundControlsBtn.innerHTML = '<i class="fas fa-bell"></i>';
        correctSound.muted = false;
        wrongSound.muted = false;
        levelCompleteSound.muted = false;
        gameCompleteSound.muted = false;
        hintSound.muted = false;
    } else {
        soundControlsBtn.innerHTML = '<i class="fas fa-bell-slash"></i>';
        correctSound.muted = true;
        wrongSound.muted = true;
        levelCompleteSound.muted = true;
        gameCompleteSound.muted = true;
        hintSound.muted = true;
    }
});

gameContainer.appendChild(soundControlsBtn);

// Add instructions button
const instructionsBtn = document.createElement('button');
instructionsBtn.className = 'btn instructions-btn';
instructionsBtn.innerHTML = '<i class="fas fa-question-circle"></i> Instructions';

const instructionsOverlay = document.createElement('div');
instructionsOverlay.className = 'overlay instructions-overlay';
instructionsOverlay.style.display = 'none';

const instructionsContainer = document.createElement('div');
instructionsContainer.className = 'hint-container instructions-container';
instructionsContainer.innerHTML = `
    <h2><i class="fas fa-book"></i> Game Instructions</h2>
    <p>Help Scoobi Paw solve the mystery of the abandoned mansion by answering questions about the Present Perfect Continuous tense in English.</p>
    <ul style="text-align: left; margin: 20px 0;">
        <li>Each room has questions that you must answer correctly.</li>
        <li>Completing a room will reveal an important clue.</li>
        <li>Collect all clues to solve the mystery at the end.</li>
        <li>The game has multiple levels of increasing difficulty.</li>
        <li>Pay attention to the correct form of Present Perfect Continuous!</li>
    </ul>
    <p><strong>Example:</strong> "The wind <u>has been blowing</u>" (correct) - "The wind <u>have been blowing</u>" (incorrect)</p>
    <button class="btn" id="close-instructions-btn">Got it!</button>
`;

instructionsBtn.addEventListener('click', () => {
    instructionsOverlay.style.display = 'block';
    instructionsContainer.style.transform = 'translate(-50%, -50%) scale(1)';
});

const closeInstructionsBtn = instructionsContainer.querySelector('#close-instructions-btn');
closeInstructionsBtn.addEventListener('click', () => {
    instructionsOverlay.style.display = 'none';
    instructionsContainer.style.transform = 'translate(-50%, -50%) scale(0)';
});

gameContainer.appendChild(instructionsBtn);
gameContainer.appendChild(instructionsOverlay);
gameContainer.appendChild(instructionsContainer);

// Adjust for mobile devices
function adjustForMobile() {
    if (window.innerWidth < 768) {
        document.querySelectorAll('.room-name').forEach(el => {
            el.style.fontSize = '1.4rem';
        });
        
        document.querySelectorAll('.dialog-box').forEach(el => {
            el.style.bottom = '120px';
            el.style.left = '20px';
            el.style.right = '20px';
            el.style.fontSize = '1rem';
        });
        
        document.querySelectorAll('.character').forEach(el => {
            el.style.width = '100px';
        });
        
        document.querySelectorAll('.question-container').forEach(el => {
            el.style.marginTop = '160px';
        });
    }
}

window.addEventListener('resize', adjustForMobile);
adjustForMobile();

// Try to play background music when the user interacts with the page
document.addEventListener('click', () => {
    AudioManager.play('background-music').catch(() => {
        // Ignore autoplay errors
    });
}, { once: true });

// Agregar estas funciones al final de tu archivo script.js

// Función para mostrar/ocultar el preloader
function togglePreloader(show) {
    const preloader = document.getElementById('preloader');
    if (show) {
        preloader.classList.remove('hidden');
    } else {
        preloader.classList.add('hidden');
    }
}

// Función para mostrar/ocultar el panel de instrucciones
function toggleInstructions(show) {
    const instructionPanel = document.getElementById('instruction-panel');
    if (show) {
        instructionPanel.classList.add('active');
    } else {
        instructionPanel.classList.remove('active');
    }
}

// Función para inicializar efectos visuales adicionales
function initVisualEffects() {
    // Mostrar controles flotantes durante el juego
    const floatingControls = document.getElementById('floating-controls');
    floatingControls.style.display = 'flex';
    
    // Aplicar efectos de sonido a botones
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (soundEffectsEnabled) {
                document.getElementById('click-sound').play().catch(e => {});
            }
        });
    });
}

// Función para crear efectos de fuegos artificiales en la pantalla final
function createFireworks() {
    const fireworksContainer = document.getElementById('fireworks');
    fireworksContainer.innerHTML = '';
    
    // Crear elementos para los fuegos artificiales
    const pyro = document.createElement('div');
    pyro.className = 'pyro';
    
    const before = document.createElement('div');
    before.className = 'before';
    
    const after = document.createElement('div');
    after.className = 'after';
    
    pyro.appendChild(before);
    pyro.appendChild(after);
    fireworksContainer.appendChild(pyro);
}

// Función para sincronizar volume-slider con los niveles de audio
function syncVolumeSlider() {
    const volumeSlider = document.getElementById('volume-slider');
    volumeSlider.value = backgroundMusic.volume * 100;
    
    volumeSlider.addEventListener('input', (e) => {
        const volume = e.target.value / 100;
        backgroundMusic.volume = volume;
        
        // Ajustar volumen de sonidos ambientales
        Object.values(ambienceSounds).forEach(sound => {
            sound.volume = volume * 0.6; // Ligeramente más bajo para ambientes
        });
        
        // Ajustar volumen de efectos de sonido
        const effectsVolume = volume * 0.8;
        correctSound.volume = effectsVolume;
        wrongSound.volume = effectsVolume;
        levelCompleteSound.volume = effectsVolume;
        gameCompleteSound.volume = effectsVolume;
        hintSound.volume = effectsVolume;
        document.getElementById('click-sound').volume = effectsVolume * 0.5;
    });
}

// Configurar botones adicionales
function setupAdditionalButtons() {
    // Botón de ayuda en controles flotantes
    document.getElementById('help-btn').addEventListener('click', () => {
        toggleInstructions(true);
    });
    
    // Botón para cerrar instrucciones
    document.getElementById('close-instructions-btn').addEventListener('click', () => {
        toggleInstructions(false);
    });
    
    // Botón de alternar música
    const musicToggle = document.getElementById('music-toggle');
    
    // Botón de alternar efectos de sonido
    const soundToggle = document.getElementById('sound-toggle');
    
    
    // Botón para compartir puntuación (opcional - puedes personalizar)
    const shareBtn = document.querySelector('.share-btn');
if (shareBtn) {
    shareBtn.addEventListener('click', () => {
        const shareModal = document.getElementById('share-modal');
        if (shareModal) {
            const shareScoreCount = document.getElementById('share-score-count');
            if (shareScoreCount) {
                shareScoreCount.textContent = score;
            }
            shareModal.classList.add('active');
            AudioManager.play('click-sound').catch(e => {});
        }
    });
}
}

// Modificar la función showEndingScreen para añadir fuegos artificiales
// (reemplaza la función existente o modifícala para incluir esto)
function enhancedEndingScreen() {
    // Stop all ambient sounds
    Object.values(ambienceSounds).forEach(sound => {
        sound.pause();
        sound.currentTime = 0;
    });
    
    AudioManager.play('game-complete-sound').catch(e => {});
    createConfetti();
    createFireworks(); // Añadir fuegos artificiales
    
    finalMessage.innerHTML = `
        <p>Congratulations, ${playerName}! ${gameData.ending.message}</p>
        <p>You answered correctly ${score} out of ${totalQuestions} questions.</p>
        <h2>Discovered Clues:</h2>
        <ul class="clues-final">
            ${discoveredClues.map(clue => `<li>${clue.clue}</li>`).join('')}
        </ul>
        <p class="final-rating">${getFinalRating()}</p>
    `;
    
    finalScreen.style.backgroundImage = `url(${gameData.ending.background})`;
    showScreen(finalScreen);
}

// Inicializar extras cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    setupTitleScreen();
    
    // Asegurar que los controles flotantes estén visibles desde el inicio
    const floatingControls = document.getElementById('floating-controls');
    if (floatingControls) {
        floatingControls.style.display = 'flex';
    }
    
    setupTitleBackground();
    // Mostrar el preloader
    togglePreloader(true);
    
    // Configurar volumen inicial
    backgroundMusic.volume = 0.5;
    
    // Cargar todos los recursos y ocultar el preloader cuando todo esté listo
    window.addEventListener('load', () => {
        setTimeout(() => {
            togglePreloader(false);
        }, 1000); // Dar tiempo para que se vea el preloader (sensación de carga)
    });
    
    // Configurar botones adicionales
    setupAdditionalButtons();
    
    // Sincronizar controles de volumen
    syncVolumeSlider();
    
    // Mostrar instrucciones si es la primera visita
    if (!localStorage.getItem('instructionsShown')) {
        setTimeout(() => {
            toggleInstructions(true);
            localStorage.setItem('instructionsShown', 'true');
        }, 1500);
    }
    
    // Modificar el comportamiento del botón de inicio para incluir efectos visuales
    const originalStartBtnHandler = startBtn.onclick;
    startBtn.onclick = function() {
        if (originalStartBtnHandler) originalStartBtnHandler();
        initVisualEffects();
    };
    
    updateAudioIcons();
});



