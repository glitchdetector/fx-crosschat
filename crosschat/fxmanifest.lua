fx_version 'adamant'
game 'common'

server_only 'yes'

name 'Cross Chat'
description 'Send chat between servers'

author 'glitchdetector'
contact 'glitchdetector@gmail.com'
download 'https://github.com/glitchdetector/fx-crosschat'

version '1.0'

convar_category 'Cross Chat' {
    'Handles cross chat messages',
    {
        {"Host", "xchat_server", "CV_BOOL", "false", "Set this server as the host"},
        {"Port", "xchat_server_port", "CV_INT", 30220},
        {"", "Connect to the target host if not set as host"},
        {"Host Target", "xchat_endpoint", "CV_STRING", "http://localhost:30220"},
    }
}

server_script 'sv_xchat.js'
