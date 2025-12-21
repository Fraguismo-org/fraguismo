## Project Overview

**Fraguismo** is a Brazilian DAO (Decentralized Autonomous Organization) platform for building "Anarcopolis" - a libertarian community. It combines social networking, gamification, e-commerce, blockchain-based governance, and token economics.

**Language**: Portuguese (pt-br)
**Framework**: Django 4.2.14
**Database**: MySQL/MariaDB
**Blockchain**: Graphene Smart Chain Testnet (Chain ID: 17027)

## Development Commands

### Setup
```bash
# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows:
.venv/Scripts/Activate.ps1
# Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements/requirements.txt

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
```

### Running the Application
```bash
# Development server (http://localhost:8000)
python manage.py runserver

# Run on specific port
python manage.py runserver 8080
```

### Database Operations
```bash
# Create migrations for all apps
python manage.py makemigrations

# Create migrations for specific app
python manage.py makemigrations members

# Apply migrations
python manage.py migrate

# Show SQL for migration
python manage.py sqlmigrate members 0001

# Check for migration issues
python manage.py makemigrations --check
```

### Shell and Debugging
```bash
# Django shell
python manage.py shell

# Database shell
python manage.py dbshell
```

## Architecture

### Django Apps Structure

**Core Applications:**

- **site_fraguismo** - Main website, landing pages, informational content about DAO/Anarcopolis
- **members** - User management with extended User model (crypto wallets, gamification)
- **rating** - Gamification system (points, levels, activities, pending tasks)
- **propostas** - DAO governance (proposal creation, blockchain-based voting)
- **graca** - Token distribution and rewards ("grace" token system)
- **marketplace** - Classified ads and business store listings
- **mercado_secundario** - P2P token trading with escrow and dispute resolution
- **administrador** - Admin panel for user management and token value configuration
- **cursos** - Course management and certifications
- **configuracoes** - User privacy/visibility settings
- **log** - Application logging and error handling
- **utils** - Shared utilities (pagination, query filtering)
- **services** - Business logic layer

### Key Models & Relationships

**User System** (members app):
- `Users` - Extended Django User with crypto wallet fields (BSC address, Lightning Network)
- `Profile` - Gamification data (nivel/level, points, squad, profile picture)
- `Squad` - Team/group assignments with chat URLs
- `ProfilePendencia` - Tracks pending tasks users must complete per level

**Gamification** (rating app):
- `Nivel` - 5-tier hierarchy: Aprendiz (5pts) → Escudeiro (15pts) → Cavaleiro (30pts) → Conselheiro (40pts) → Guardiao (40pts)
- `Atividade` - Types of activities that award points
- `LogRating` - Audit trail of all point transactions
- `Pendencia` - Requirements/tasks associated with each level

**Governance** (propostas app):
- `Proposta` - Proposals with file attachments and SHA256 hash verification
- `Voto` - Voting records (boolean: favor/against)
- Blockchain-integrated voting system

**Marketplace** (marketplace app):
- `Anuncio` - Classified ads with departments (Agro, Food, Auto, Electronics, etc.)
- `Loja` - Business stores with social media integration
- `Images` - Multiple images per advertisement
- `ComentarioAnuncio` - Ad comments/reviews

**Token Value** (administrador app):
- `ValorToken` - Tracks token value in BRL for exchange calculations

### Database Configuration

- **Engine**: MySQL/MariaDB with InnoDB
- **Connection**: Configured via environment variables (.env file)
- **Settings**: Connection pooling enabled, strict transaction mode
- **Production paths**: /var/www/fraguismo/media/, /var/www/fraguismo/static/

### Web3/Blockchain Integration

**Smart Chain**: Graphene Smart Chain Testnet (Chain ID: 17027)

**Web3 Features**:
- MetaMask wallet connection (site_fraguismo/static/js/web3/wallet.js)
- Smart contract interactions for voting, token operations, grace distribution
- BSC and Lightning Network wallet address storage
- ethers.js library for blockchain interactions

**Key Contract Operations**:
- Proposal voting on-chain
- Token buy/withdraw operations
- Grace token distribution

### Code Organization Patterns

**URL Structure**:
- Main URLs in `fraguismo/urls.py`
- App-specific routes in dedicated `routes/` folders
- Example: `members/routes/members.py`, `propostas/routes/propostas.py`

**View Organization**:
- Larger apps separate views by function in `views/` directories
- Authentication required for most views (`@login_required` decorator)
- Permission checks based on user level (`Profile.nivel`)
- Superuser-only views use `@user_passes_test(lambda u: u.is_superuser)`

**Service Layer**:
- Business logic extracted to `services/` directory
- `QueryFilterService` - Detects query type (phone, email, ID, Instagram, username)
- Promotes code reuse across views

**Naming Conventions**:
- Portuguese throughout (models, views, URLs, templates)
- snake_case for Python code
- kebab-case for URL patterns
- English for technical terms (e.g., model field names like `created_at`)

### Authentication & Permissions

**User Model**: Custom `Users` model extends Django's built-in User
- Email field is unique and required
- Additional fields: crypto wallets, Instagram handle, referral tracking, code of conduct acceptance

**Access Control**:
- Level-based permissions (only certain níveis can create proposals, vote, etc.)
- Profile completion requirements (`ProfilePendencia`)
- Admin vs. regular user separation

**Security Features**:
- File upload validation (type, size)
- SHA256 hash storage for file integrity (proposals)
- CSRF protection enabled
- ORM prevents SQL injection
- Custom error handlers (404, 500, 403, 400) in log app

### External Dependencies

**Key Libraries**:
- django-bootstrap5 - Bootstrap 5 integration for frontend
- mysqlclient - MySQL database driver
- Pillow - Image processing for profile pictures and ad images
- python-decouple - Environment configuration management
- beautifulsoup4 - HTML parsing

**Email Configuration**:
- SMTP backend (Office365)
- Used for password resets and notifications
- Configured via environment variables

### File Storage

**Media Files**:
- Development: Local media folder
- Production: /var/www/fraguismo/media/
- User uploads: profile pictures, ad images, proposal documents
- Image processing via Pillow

**Static Files**:
- Production: /var/www/fraguismo/static/
- Includes custom JavaScript (Web3 integration), CSS/SCSS, Bootstrap

## Deployment

**CI/CD**: GitHub Actions workflow on push to `develop` branch
- File: .github/workflows/deploy-develop.yml
- Method: SSH to VPS, executes deploy_teste.sh
- Target: Test/staging environment

**Environment**: VPS-based hosting with separate dev/production environments

## Important Considerations

1. **All user-facing content is in Portuguese** - maintain this convention
2. **Gamification is central** - users progress through 5 níveis by earning points
3. **Blockchain integration** - test thoroughly with Graphene testnet before production
4. **Permission-based access** - always check user level before allowing sensitive operations
5. **File integrity** - proposals use SHA256 hashing for document verification
6. **Escrow system** - mercado_secundario has complex buyer/seller/arbitrator flow
7. **Referral tracking** - users can be referred by others (`quem_indicou` field)
8. **MySQL-specific** - migrations may need adjustments for other databases
